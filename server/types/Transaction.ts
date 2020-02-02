export interface Transaction {
  transaction_id: string;
  timestamp: string;
  amount: number;
  currency: string;
  description: string;
  transaction_type: string;
  transaction_category: string;
  transaction_classification: Array<string>;
  running_balance?: {
    currency: string;
    amount: number;
  };
  meta: object;
}
