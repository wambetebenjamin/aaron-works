export type Role = "client" | "freelancer";

export type Availability = "available" | "limited" | "busy";

export interface Review {
  id: string;
  author: string;
  company: string;
  rating: number;
  date: string;
  body: string;
  project: string;
}

export interface WorkHistoryItem {
  id: string;
  title: string;
  client: string;
  year: string;
  outcome: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  caption: string;
  image: string;
}

export interface Freelancer {
  id: string;
  username: string;
  name: string;
  title: string;
  category: string;
  location: string;
  avatar: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  availability: Availability;
  skills: string[];
  bio: string;
  languages: string[];
  memberSince: string;
  successRate: number;
  portfolio: PortfolioItem[];
  workHistory: WorkHistoryItem[];
  reviews: Review[];
  email: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  memberSince: string;
  jobsPosted: number;
  location: string;
  verified: boolean;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string[];
  skills: string[];
  budgetType: "fixed" | "hourly";
  budgetMin: number;
  budgetMax: number;
  currency: "KES";
  deadline: string;
  postedDaysAgo: number;
  proposalCount: number;
  client: Client;
  status: "open" | "in-progress" | "closed";
  attachments?: string[];
}

export interface Proposal {
  id: string;
  jobId: string;
  jobTitle: string;
  freelancerId: string;
  freelancerName: string;
  freelancerUsername: string;
  freelancerAvatar: string;
  clientId: string;
  coverLetter: string;
  rate: number;
  deliveryDays: number;
  createdAt: string;
  status: "pending" | "shortlisted" | "hired" | "declined";
}

export interface Contract {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  freelancerName: string;
  freelancerUsername: string;
  amount: number;
  startedAt: string;
  progress: number;
  status: "active" | "completed";
}

export interface PaymentRow {
  id: string;
  date: string;
  description: string;
  amount: number;
  method: "Escrow release" | "Escrow top-up" | "Withdrawal" | "Platform fee";
  status: "paid" | "in escrow" | "processing";
  /** Owning client and freelancer, used to scope dashboard tables. */
  clientName?: string;
  freelancerUsername?: string;
}

export interface Thread {
  id: string;
  participants: {
    clientId: string;
    clientName: string;
    clientAvatar: string;
    freelancerId: string;
    freelancerName: string;
    freelancerAvatar: string;
  };
  subject: string;
  jobTitle: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    body: string;
    sentAt: string;
  }[];
  unread: boolean;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  passwordHash: string;
  avatar: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  captchaScore: number | null;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  count: number;
  blurb: string;
}

export interface Store {
  users: StoredUser[];
  freelancers: Freelancer[];
  jobs: Job[];
  proposals: Proposal[];
  contracts: Contract[];
  payments: PaymentRow[];
  threads: Thread[];
  contacts: ContactMessage[];
}
