import { Discount } from "./discount.model";

export interface Product {
    id?: number;
    name: string;
    price: number;
    discounts?: Discount[];
}