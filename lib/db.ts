import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { EMPTY_STORE } from "./seed";
import { hashPassword, verifyPassword } from "./password";
import type {
  ContactMessage,
  Freelancer,
  Job,
  Proposal,
  Role,
  Store,
  StoredUser,
  Thread,
} from "./types";

/**
 * Demo persistence layer.
 *
 * - If KV_REST_API_URL + KV_REST_API_TOKEN are configured, the store is kept in
 *   Vercel KV (production path).
 * - Otherwise the store lives in memory and, in development, is mirrored to
 *   data/runtime.json so a restart keeps demo data. Vercel's filesystem is
 *   read-only at runtime, so writes there are best-effort only.
 */

const RUNTIME_FILE = path.join(process.cwd(), "data", "runtime.json");
const KV_KEY = "aaron-works:store:v1";
const globalForStore = globalThis as unknown as {
  __aaronWorksStore?: Store;
  __aaronWorksStoreLoaded?: Promise<Store>;
};

const DEMO_PASSWORD = "Demo1234!";

function cloneSeed(): Store {
  const store: Store = JSON.parse(JSON.stringify(EMPTY_STORE));
  const demoHash = hashPassword(DEMO_PASSWORD);
  store.users = store.users.map((u) => ({ ...u, passwordHash: demoHash }));
  return store;
}

async function kvClient() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  try {
    const mod = await import("@vercel/kv");
    return mod.kv;
  } catch {
    return null;
  }
}

async function loadStore(): Promise<Store> {
  const seed = cloneSeed();

  const kv = await kvClient();
  if (kv) {
    try {
      const saved = await kv.get<Store>(KV_KEY);
      if (saved && saved.users?.length) {
        return {
          ...seed,
          ...saved,
          freelancers: seed.freelancers,
          contacts: saved.contacts ?? [],
        };
      }
    } catch {
      // fall through to seed
    }
    return seed;
  }

  try {
    const raw = await readFile(RUNTIME_FILE, "utf8");
    const saved = JSON.parse(raw) as Partial<Store>;
    if (saved.users?.length) {
      return {
        ...seed,
        ...saved,
        freelancers: seed.freelancers,
        contacts: saved.contacts ?? [],
      };
    }
  } catch {
    // no runtime data yet
  }
  return seed;
}

export async function getStore(): Promise<Store> {
  if (globalForStore.__aaronWorksStore) return globalForStore.__aaronWorksStore;
  if (!globalForStore.__aaronWorksStoreLoaded) {
    globalForStore.__aaronWorksStoreLoaded = loadStore().then((store) => {
      globalForStore.__aaronWorksStore = store;
      return store;
    });
  }
  return globalForStore.__aaronWorksStoreLoaded;
}

async function persist(store: Store) {
  const kv = await kvClient();
  if (kv) {
    try {
      await kv.set(KV_KEY, store);
    } catch {
      // non-blocking
    }
    return;
  }
  try {
    await mkdir(path.dirname(RUNTIME_FILE), { recursive: true });
    await writeFile(RUNTIME_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // read-only filesystem (e.g. Vercel) — demo data stays in memory
  }
}

export async function findUserByEmail(email: string) {
  const store = await getStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  const store = await getStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function authenticate(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  username?: string;
}): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const store = await getStore();
  const email = input.email.toLowerCase().trim();
  if (store.users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const base =
    input.username?.trim() ||
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  let username = base || `member-${Date.now()}`;
  let n = 2;
  while (store.users.some((u) => u.username === username)) {
    username = `${base}-${n++}`;
  }
  const user: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim(),
    email,
    username,
    role: input.role,
    passwordHash: hashPassword(input.password),
    avatar:
      input.role === "freelancer"
        ? "/images/freelancers/amina-hassan.jpg"
        : "/images/freelancers/grace-wanjiru.jpg",
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await persist(store);
  return { ok: true, user };
}

export async function createJob(job: Job) {
  const store = await getStore();
  store.jobs.unshift(job);
  await persist(store);
  return job;
}

export async function createProposal(proposal: Proposal) {
  const store = await getStore();
  store.proposals.unshift(proposal);
  const job = store.jobs.find((j) => j.id === proposal.jobId);
  if (job) job.proposalCount += 1;
  await persist(store);
  return proposal;
}

export async function createThreadMessage(input: {
  threadId?: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  body: string;
  jobTitle?: string;
  participants?: Thread["participants"];
}) {
  const store = await getStore();
  const now = new Date().toISOString();

  if (input.threadId) {
    const thread = store.threads.find((t) => t.id === input.threadId);
    if (thread) {
      thread.messages.push({
        id: `msg-${Date.now()}`,
        senderId: input.senderId,
        senderName: input.senderName,
        body: input.body,
        sentAt: now,
      });
      await persist(store);
      return thread;
    }
  }

  if (input.participants) {
    const thread: Thread = {
      id: `thread-${Date.now()}`,
      subject: input.jobTitle ? `New conversation — ${input.jobTitle}` : "New conversation",
      jobTitle: input.jobTitle || "Direct message",
      participants: input.participants,
      unread: true,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: input.senderId,
          senderName: input.senderName,
          body: input.body,
          sentAt: now,
        },
      ],
    };
    store.threads.unshift(thread);
    await persist(store);
    return thread;
  }

  return null;
}

export async function saveContactMessage(message: ContactMessage) {
  const store = await getStore();
  store.contacts.unshift(message);
  await persist(store);
}

export async function getFreelancer(username: string): Promise<Freelancer | null> {
  const store = await getStore();
  return store.freelancers.find((f) => f.username === username) ?? null;
}

export async function getJob(id: string): Promise<Job | null> {
  const store = await getStore();
  return store.jobs.find((j) => j.id === id || j.slug === id) ?? null;
}

export { DEMO_PASSWORD };
