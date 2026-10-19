import {
  Briefcase,
  Clapperboard,
  Code2,
  Database,
  FileText,
  Languages,
  Megaphone,
  PenTool,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  code: Code2,
  "pen-tool": PenTool,
  "file-text": FileText,
  clapperboard: Clapperboard,
  megaphone: Megaphone,
  database: Database,
  languages: Languages,
  briefcase: Briefcase,
};

export default function CategoryIcon({
  name,
  size = 22,
}: {
  name: string;
  size?: number;
}) {
  const Icon = MAP[name] ?? Briefcase;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
