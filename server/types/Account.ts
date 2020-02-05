export interface Account {
  update_timestamp: string;
  account_id: string;
  account_type: string;
  display_name: string;
  currency: string;
  account_number: Array<any>;
  provider: Array<any>;
}
