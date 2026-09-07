export interface DashboardStats {
  clients: number;
  bookValue: string;
}

export interface TodaysBrief {
  label: string;
  text: string;
  actions: string[];
}

export type BadgeColor = "red" | "green" | "yellow" | "orange";

export interface AttentionCard {
  initials: string;
  name: string;
  aum: string;
  badge: string | null;
  badgeColor: BadgeColor | null;
  note: string;
  meta: string | null;
  cta: string | null;
}

export interface ClientsNeedingAttention {
  count: number;
  cards: AttentionCard[];
}

export interface RmHeartbeat {
  label: string;
  badge: string;
  clients: number;
  holdings: number;
  flagged: number;
  totalAum: string;
  aumChange: string;
  filters: string[];
  note: string;
}

export interface DashboardContent {
  user: string;
  date: string;
  stats: DashboardStats;
  todaysBrief: TodaysBrief;
  clientsNeedingAttention: ClientsNeedingAttention;
  rmHeartbeat: RmHeartbeat;
}
