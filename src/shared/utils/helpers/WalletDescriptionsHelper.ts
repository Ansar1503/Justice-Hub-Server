export function generateDescription(transactionData: {
  type: "debit" | "credit";
  category: "deposit" | "withdrawal" | "payment" | "refund" | "transfer";
  amount: number;
}) {
  const { type, category, amount } = transactionData;

  switch (category) {
    case "deposit":
      return `Added ₹${amount} ${type}ed via Stripe`;
    case "withdrawal":
      return `Withdrew ₹${amount} ${type}d to your bank account`;
    case "payment":
      return `Payment of ₹${amount} ${type}d from wallet`;
    case "refund":
      return `Refund of ₹${amount} ${type}d to wallet`;
    case "transfer":
      return `Transferred ₹${amount} ${type}ed to wallet`;
    default:
      return `Transaction of ₹${amount}`;
  }
}
