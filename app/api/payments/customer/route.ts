import { NextRequest, NextResponse } from 'next/server';

interface CustomerPaymentData {
  id: string;
  customerName: string;
  itineraryReference: string;
  totalCost: number;
  amountPaid: number;
  paymentDate: string;
  remainingBalance: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  shareMethod: 'whatsapp' | 'email';
  paymentLink: string;
  currency: string;
}

interface PaymentHistory {
  id: string;
  paidDate: string;
  amountPaid: number;
  pendingAmount: number;
  status: string;
  invoiceUrl?: string;
}

interface PaymentReminder {
  id: string;
  type: string;
  message: string;
  time: string;
  date: string;
  status: 'RECENT' | 'SENT' | 'PENDING';
}

// GET - Fetch customer payment data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;
    
    // In a real application, you would fetch from your database
    // Example using Prisma, MongoDB, or your preferred ORM/database
    
    // const paymentData = await prisma.customerPayment.findUnique({
    //   where: { id },
    //   include: {
    //     paymentHistory: true,
    //     reminders: true,
    //   }
    // });

    // Mock response for demonstration - replace with actual database query
    const paymentData: CustomerPaymentData = {
      id,
      customerName: `Customer ${id}`, // Mock data - Will be fetched from database
      itineraryReference: `ITN-${id.slice(-6)}`,
      totalCost: 5000,
      amountPaid: 2000,
      paymentDate: new Date().toISOString(),
      remainingBalance: 3000,
      paymentStatus: 'Partial',
      shareMethod: 'whatsapp',
      paymentLink: `https://payment.example.com/${id}`,
      currency: 'USD'
    };

    const paymentHistory: PaymentHistory[] = [
      {
        id: `hist_${id}_1`,
        paidDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        amountPaid: 2000,
        pendingAmount: 3000,
        status: 'Completed',
        invoiceUrl: `https://invoice.example.com/${id}_1`
      }
    ];

    const reminders: PaymentReminder[] = [
      {
        id: `rem_${id}_1`,
        type: 'Payment Due',
        message: 'Payment reminder for remaining balance',
        time: '10:00',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PENDING'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        payment: paymentData,
        history: paymentHistory,
        reminders: reminders
      }
    });

  } catch (error) {
    console.error('Error fetching customer payment data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update customer payment data
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;
    const updateData = await request.json();

    // Validate required fields
    const requiredFields = ['customerName', 'itineraryReference', 'totalCost'];
    const missingFields: string[] = [];
    
    for (const field of requiredFields) {
      if (!updateData[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const totalCost = parseFloat(updateData.totalCost);
    const amountPaid = parseFloat(updateData.amountPaid || '0');

    if (isNaN(totalCost) || totalCost < 0) {
      return NextResponse.json(
        { error: 'Invalid total cost value' },
        { status: 400 }
      );
    }

    if (isNaN(amountPaid) || amountPaid < 0) {
      return NextResponse.json(
        { error: 'Invalid amount paid value' },
        { status: 400 }
      );
    }

    // Calculate remaining balance and payment status
    const remainingBalance = totalCost - amountPaid;
    let paymentStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue' = 'Pending';

    if (remainingBalance <= 0) {
      paymentStatus = 'Paid';
    } else if (amountPaid > 0) {
      paymentStatus = 'Partial';
    } else {
      // Check if overdue based on payment date
      const paymentDate = new Date(updateData.paymentDate || Date.now());
      const currentDate = new Date();
      if (currentDate > paymentDate) {
        paymentStatus = 'Overdue';
      }
    }
    
    const updatedData = {
      ...updateData,
      totalCost,
      amountPaid,
      remainingBalance,
      paymentStatus,
      id,
      updatedAt: new Date().toISOString()
    };

    // Update in database
    // const updated = await prisma.customerPayment.update({
    //   where: { id },
    //   data: updatedData
    // });

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'Payment data updated successfully'
    });

  } catch (error) {
    console.error('Error updating customer payment data:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new payment record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentData = await request.json();

    // Validate required fields for new payment
    const requiredFields = ['customerName', 'itineraryReference', 'totalCost'];
    const missingFields: string[] = [];
    
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    const totalCost = parseFloat(paymentData.totalCost);
    const amountPaid = parseFloat(paymentData.amountPaid || '0');

    if (isNaN(totalCost) || totalCost < 0) {
      return NextResponse.json(
        { error: 'Invalid total cost value' },
        { status: 400 }
      );
    }

    const newPaymentRecord: CustomerPaymentData = {
      id,
      customerName: paymentData.customerName,
      itineraryReference: paymentData.itineraryReference,
      totalCost,
      amountPaid,
      paymentDate: paymentData.paymentDate || new Date().toISOString(),
      remainingBalance: totalCost - amountPaid,
      paymentStatus: amountPaid >= totalCost ? 'Paid' : amountPaid > 0 ? 'Partial' : 'Pending',
      shareMethod: paymentData.shareMethod || 'whatsapp',
      paymentLink: paymentData.paymentLink || `https://payment.example.com/${id}`,
      currency: paymentData.currency || 'USD'
    };

    // Create in database
    // const created = await prisma.customerPayment.create({
    //   data: newPaymentRecord
    // });

    return NextResponse.json({
      success: true,
      data: newPaymentRecord,
      message: 'Payment record created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating payment record:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove payment record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {  } = await params;

    // Delete from database
    // const deleted = await prisma.customerPayment.delete({
    //   where: { id }
    // });

    return NextResponse.json({
      success: true,
      message: 'Payment record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting payment record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}