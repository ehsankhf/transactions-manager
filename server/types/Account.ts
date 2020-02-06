export interface Account {
  update_timestamp: string;
  account_id: string;
  account_type: string;
  display_name: string;
  currency: string;
  account_number: {
    iban?: string;
    number?: string;
    sort_code?: string;
    swift_bi: string;
    blz?: string;
  };
  provider: {
    display_name: string;
    logo_uri: string;
    provider_id: string;
  };
}
