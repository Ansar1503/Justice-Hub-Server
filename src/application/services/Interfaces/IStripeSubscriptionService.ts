export interface CreateStripeSubscriptionProduct {
    name: string;
    description?: string;
  }
  
  export interface CreateStripePrice {
    productId: string;
    amount: number; 
    currency: string;
    interval: "month" | "year" | "none";
  }
  
  export interface IStripeSubscriptionService {
    createProduct(data: CreateStripeSubscriptionProduct): Promise<string>;
    createPrice(data: CreateStripePrice): Promise<string>;
    deleteProduct(productId: string): Promise<void>;
    updateProduct(productId: string, data: { name?: string; description?: string }): Promise<void>;
    deactivatePrice(priceId: string): Promise<void>;
    updateProductActiveStatus(productId: string, isActive: boolean): Promise<void>; 
    updatePriceActiveStatus(priceId: string, isActive: boolean): Promise<void>;     
  }
  