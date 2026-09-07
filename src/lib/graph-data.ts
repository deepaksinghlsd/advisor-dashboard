export type GraphNodeType = "rm" | "client" | "category" | "holding";

export type AssetClass = "equity" | "mutualFunds" | "debt" | "reits" | "alts";

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: GraphNodeType;
  value: number;
  assetClass?: AssetClass;
  flagged?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const client = (
  id: string,
  label: string,
  sublabel: string,
  value: number,
  flagged = false
): GraphNode => ({ id, label, sublabel, type: "client", value, flagged });

const category = (id: string, label: string, assetClass: AssetClass, value = 16, flagged = false): GraphNode => ({
  id,
  label,
  type: "category",
  value,
  assetClass,
  flagged,
});

const holding = (id: string, label: string, assetClass: AssetClass, value = 7, flagged = false): GraphNode => ({
  id,
  label,
  type: "holding",
  value,
  assetClass,
  flagged,
});

export const graphData: GraphData = {
  nodes: [
    { id: "rm", label: "RM", sublabel: "Palash Jain", type: "rm", value: 34 },

    client("c-rahul", "RM", "Rahul Mehta · ₹3.2 Cr", 20, true),
    client("c-priya", "PV", "Priya Venkat · ₹4.6 Cr", 22),
    client("c-varun", "VK", "Varun Kapoor · ₹7.1 Cr", 26, true),
    client("c-kabir", "KS", "Kabir Singhania · ₹8.0 Cr", 27),
    client("c-vikram", "VM", "Vikram Malhotra · ₹6.4 Cr", 24),

    category("cat-rahul-equity", "Equity", "equity"),
    category("cat-rahul-mf", "Mutual Funds", "mutualFunds"),
    category("cat-rahul-debt", "Debt & Cash", "debt"),

    holding("h-tatamotors", "TATAMOTORS", "equity", 7, true),
    holding("h-dixon", "DIXON", "equity", 7, true),
    holding("h-jwl", "JWL", "equity", 6, true),
    holding("h-hdfcbank", "HDFCBANK", "equity"),
    holding("h-tcs-1", "TCS", "equity"),
    holding("h-nippon", "Nippon Multi Cap", "mutualFunds"),
    holding("h-sbismall", "SBI Small Cap", "mutualFunds"),
    holding("h-ppfas", "Parag Parikh Flexi", "mutualFunds"),
    holding("h-hdfcbal", "HDFC Balanced Adv", "mutualFunds"),
    holding("h-gsec2034", "G-Sec 2034 7.18%", "debt"),

    category("cat-varun-equity", "Equity", "equity"),
    category("cat-varun-reits", "REITs", "reits"),
    category("cat-varun-bonds", "Bonds & G-Sec", "debt"),

    holding("h-reliance", "RELIANCE", "equity"),
    holding("h-icicibank", "ICICIBANK", "equity"),
    holding("h-ntpc", "NTPC", "equity"),
    holding("h-embassy", "Embassy REIT", "reits"),
    holding("h-gsec738", "G-Sec 7.38%", "debt"),
    holding("h-hdfccorp", "HDFC Corp Bond", "debt"),

    category("cat-kabir-equity", "Direct Equity", "equity", 18),
    holding("h-titan", "TITAN", "equity"),
    holding("h-bajfinance", "BAJFINANCE", "equity"),
    holding("h-hcltech", "HCLTECH", "equity"),
    holding("h-tcs-2", "TCS", "equity"),

    category("cat-priya-equity", "Equity Direct", "equity", 18),
    category("cat-priya-debt", "Debt & Liquid", "debt"),

    holding("h-bhartiartl", "BHARTIARTL", "equity"),
    holding("h-infy", "INFY", "equity"),
    holding("h-sunpharma", "SUNPHARMA", "equity"),
    holding("h-lntinfra", "L&T Infra", "equity"),
    holding("h-liquidfund", "Liquid Fund", "debt"),
    holding("h-gsec2030", "G-Sec 2030", "debt"),

    category("cat-vikram-reits", "Real Estate REITs", "reits"),
    category("cat-vikram-alts", "Private Equity / Alts", "alts"),
    category("cat-vikram-debt", "Structured Debt", "alts"),

    holding("h-brookfield", "Brookfield REIT", "reits"),
    holding("h-pegrowth", "PE Growth IV", "alts"),
  ],
  links: [
    { source: "rm", target: "c-rahul" },
    { source: "rm", target: "c-priya" },
    { source: "rm", target: "c-varun" },
    { source: "rm", target: "c-kabir" },
    { source: "rm", target: "c-vikram" },

    { source: "c-rahul", target: "cat-rahul-equity" },
    { source: "c-rahul", target: "cat-rahul-mf" },
    { source: "c-rahul", target: "cat-rahul-debt" },
    { source: "cat-rahul-equity", target: "h-tatamotors" },
    { source: "cat-rahul-equity", target: "h-dixon" },
    { source: "cat-rahul-equity", target: "h-jwl" },
    { source: "cat-rahul-equity", target: "h-hdfcbank" },
    { source: "cat-rahul-equity", target: "h-tcs-1" },
    { source: "cat-rahul-mf", target: "h-nippon" },
    { source: "cat-rahul-mf", target: "h-sbismall" },
    { source: "cat-rahul-mf", target: "h-ppfas" },
    { source: "cat-rahul-mf", target: "h-hdfcbal" },
    { source: "cat-rahul-debt", target: "h-gsec2034" },

    { source: "c-varun", target: "cat-varun-equity" },
    { source: "c-varun", target: "cat-varun-reits" },
    { source: "c-varun", target: "cat-varun-bonds" },
    { source: "cat-varun-equity", target: "h-reliance" },
    { source: "cat-varun-equity", target: "h-icicibank" },
    { source: "cat-varun-equity", target: "h-ntpc" },
    { source: "cat-varun-reits", target: "h-embassy" },
    { source: "cat-varun-bonds", target: "h-gsec738" },
    { source: "cat-varun-bonds", target: "h-hdfccorp" },

    { source: "c-kabir", target: "cat-kabir-equity" },
    { source: "cat-kabir-equity", target: "h-titan" },
    { source: "cat-kabir-equity", target: "h-bajfinance" },
    { source: "cat-kabir-equity", target: "h-hcltech" },
    { source: "cat-kabir-equity", target: "h-tcs-2" },

    { source: "c-priya", target: "cat-priya-equity" },
    { source: "c-priya", target: "cat-priya-debt" },
    { source: "cat-priya-equity", target: "h-bhartiartl" },
    { source: "cat-priya-equity", target: "h-infy" },
    { source: "cat-priya-equity", target: "h-sunpharma" },
    { source: "cat-priya-equity", target: "h-lntinfra" },
    { source: "cat-priya-debt", target: "h-liquidfund" },
    { source: "cat-priya-debt", target: "h-gsec2030" },

    { source: "c-vikram", target: "cat-vikram-reits" },
    { source: "c-vikram", target: "cat-vikram-alts" },
    { source: "c-vikram", target: "cat-vikram-debt" },
    { source: "cat-vikram-reits", target: "h-brookfield" },
    { source: "cat-vikram-alts", target: "h-pegrowth" },
  ],
};
