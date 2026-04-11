export type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
};

export type TokenAdd = {
  id: string;
  count: number;
  price: number;
  options: string;
};
