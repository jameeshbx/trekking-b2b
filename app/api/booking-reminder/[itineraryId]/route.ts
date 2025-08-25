import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
  const { itineraryId } = await params;
  const reminders = await prisma.bookingReminder.findMany({
    where: { itineraryId },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ success: true, data: reminders });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
  const { itineraryId } = await params;
  const body = await request.json();
  const { date, note } = body;
  const reminder = await prisma.bookingReminder.create({
    data: { itineraryId, date: new Date(date), note },
  });
  return NextResponse.json({ success: true, data: reminder });
}