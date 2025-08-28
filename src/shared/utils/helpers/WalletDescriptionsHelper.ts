function generateDescription(transactionData: {
  type: "debit" | "credit";
  category: "deposit" | "withdrawal" | "payment" | "refund" | "transfer";
  amount: number;
}) {
  const { type, category, amount } = transactionData;

  if (category === "deposit") {
    return `Added ₹${amount} ${type}ed via stripe`;
  }
  if (category === "withdrawal") {
    return `Withdrew ₹${amount} ${type}d to your bank account`;
  }
  if (category === "payment") {
    return `Payment of ₹${amount} ${type}d from wallet`;
  }
  if (category === "refund") {
    return `Refund of ₹${amount} ${type}d to wallet`;
  }
}
