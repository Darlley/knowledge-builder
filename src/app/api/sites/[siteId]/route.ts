import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { siteId: string } }) {
  const { siteId } = params; // Aqui você captura o siteId da URL

  // Agora você pode usar o siteId
  return NextResponse.json({ message: `Site ID: ${siteId}` });
}