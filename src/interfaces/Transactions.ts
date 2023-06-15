export interface Transaction {
  id: string;
  description: string;
  type: number;
  start_date: Date;
  payment_method: string;
  tag: string;
  value: number;
  user_id: string;
}

export interface CreateTransactionValues {
  description: string;
  type: TransactionType;
  start_date: string;
  payment_method: string;
  tag: string;
  value: number;
  user_id: string;
}

export enum TransactionType {
  Expense,
  Income,
}
