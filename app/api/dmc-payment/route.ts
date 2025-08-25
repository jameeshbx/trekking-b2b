import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler to fetch payment details
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const enquiryId = searchParams.get('enquiryId');

  if (!enquiryId) {
    return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
  }

  try {
    const payments = await prisma.dmcPayment.findMany({
      where: { enquiryId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error('Error fetching DMC payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payment details' }, { status: 500 });
  }
}

// POST handler to save payment details
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { dmcId, enquiryId, ...paymentData } = data;

    if (!dmcId || !enquiryId) {
      return NextResponse.json({ error: 'DMC ID and Enquiry ID are required' }, { status: 400 });
    }

    const newPayment = await prisma.dmcPayment.create({
      data: {
        ...paymentData,
        totalCost: parseFloat(paymentData.totalCost),
        amountPaid: parseFloat(paymentData.amountPaid),
        remainingBalance: parseFloat(paymentData.remainingBalance),
        paymentDate: new Date(paymentData.paymentDate),
        dmc: { connect: { id: dmcId } },
        enquiry: { connect: { id: enquiryId } },
      },
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('Error creating DMC payment:', error);
    return NextResponse.json({ error: 'Failed to save payment details' }, { status: 500 });
  }
}
