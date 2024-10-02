// types.ts (or inside the same component if you prefer)
export interface Product {
    id: string;
    item_key: string;
    item_name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId?: string;
    image?: string;
  }
  
  export interface Category {
    globalCategory: string | null;  // Allow for null/undefined values for handling missing categories
    name: string;
    sortGroup: number;
  }
  