export const pricingKeys = {
  all: ["pricing"] as const,
  products: () => ["pricing", "products"] as const,
};
