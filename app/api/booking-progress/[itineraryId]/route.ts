import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
  const { itineraryId } = await params;
  const progress = await prisma.bookingProgress.findMany({
    where: { itineraryId },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ success: true, data: progress });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ itineraryId: string }> }) {
  const { itineraryId } = await params;
  const body = await request.json();
  const { date, service, status, dmcNotes } = body;
  const progress = await prisma.bookingProgress.create({
    data: { itineraryId, date: new Date(date), service, status, dmcNotes },
  });
  return NextResponse.json({ success: true, data: progress });
}
// /api/booking-progress/[itineraryId]/[id]/route.ts
export async function PUT(request: NextRequest, { params }: { params: Promise<{ itineraryId: string, id: string }> }) {
  const {id } = await params;
  const body = await request.json();
  const { date, service, status, dmcNotes } = body;
  
  const progress = await prisma.bookingProgress.update({
    where: { id },
    data: { 
      date: new Date(date), 
      service, 
      status, 
      dmcNotes: dmcNotes || null 
    },
  });
  
  return NextResponse.json({ success: true, data: progress });
}