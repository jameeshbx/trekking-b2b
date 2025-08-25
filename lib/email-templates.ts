interface DmcPaymentEmailProps {
  dmcName: string;
  itineraryReference: string;
  totalCost: string;
  amountPaid: string;
  paymentDate: string;
  remainingBalance: string;
  paymentStatus: string;
  paymentChannel: string;
  transactionId?: string;
  currency: string;
}

export const dmcPaymentNotificationTemplate = ({ 
  dmcName,
  itineraryReference,
  totalCost,
  amountPaid,
  paymentDate,
  remainingBalance,
  paymentStatus,
  paymentChannel,
  transactionId,
  currency
}: DmcPaymentEmailProps) => `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Payment Notification</title>
  </head>
  <body>
    <h1>Payment Notification</h1>
    <p>Dear ${dmcName},</p>
    <p>A payment has been processed for the itinerary: <strong>${itineraryReference}</strong>.</p>
    <h2>Payment Details:</h2>
    <ul>
      <li><strong>Total Cost:</strong> ${totalCost} ${currency}</li>
      <li><strong>Amount Paid:</strong> ${amountPaid} ${currency}</li>
      <li><strong>Payment Date:</strong> ${paymentDate}</li>
      <li><strong>Remaining Balance:</strong> ${remainingBalance} ${currency}</li>
      <li><strong>Status:</strong> ${paymentStatus}</li>
      <li><strong>Payment Channel:</strong> ${paymentChannel}</li>
      ${transactionId ? `<li><strong>Transaction ID:</strong> ${transactionId}</li>` : ''}
    </ul>
    <p>Thank you.</p>
  </body>
  </html>
`;
