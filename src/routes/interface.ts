interface transactionInterface {
  references: string;
  senderAccountNumber: number;
  amount: number;
  receiverAccountNumber: number;
  transferDescription: string;
  createdAt: string;
}

interface balancesInterface {
  accountNo: number;
  balance: number;
  createdAt: string;
}
export { transactionInterface, balancesInterface };
