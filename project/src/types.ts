export type Question = {
  id: string;
  text: string;
  options: {
    value: number;
    label: string;
    tooltip?: string;
  }[];
  multiple?: boolean;
  showIf?: (data: Partial<FormData>) => boolean;
};

export type FormData = {
  industry: string;
  years: number;
  employees: number;
  revenue_trend: number;
  likability: number;
  market_share: number;
  customer_base: string;
  usp: number;
  digital_skills: number;
  data_management: number;
  profit_margins: number;
  debt: number;
  cash_flow: number;
  supply_chain?: number;
  inventory_management?: number;
  email?: string;
  phone?: string;
  company_name?: string;
};