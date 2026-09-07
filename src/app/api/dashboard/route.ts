import { NextResponse } from "next/server";
import content from "@/lib/content.json";
import type { DashboardContent } from "@/lib/types";

export async function GET() {
  return NextResponse.json(content as DashboardContent);
}
