import moment from 'moment/moment';

export interface Transaction {
  id: number;
  description: string;
  type: number;
  startDate: Date;
  paymentMethod: string;
  tag: string;
  value: number;
  userId: string;
}

export interface CreateTransactionValues {
  description: string;
  type: TransactionType;
  startDate: string;
  paymentMethod: string;
  tag: string;
  value: number;
  userId: string;
}

export enum TransactionType {
  Expense,
  Income,
}
