import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
  const { itineraryId } = await params;
  const feedbacks = await prisma.bookingFeedback.findMany({
    where: { itineraryId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ success: true, data: feedbacks });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
  const { itineraryId } = await params;
  const body = await request.json();
  const { note } = body;
  const feedback = await prisma.bookingFeedback.create({
    data: { itineraryId, note },
  });
  return NextResponse.json({ success: true, data: feedback });
}