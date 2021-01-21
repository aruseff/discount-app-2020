import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';


@Injectable({
    providedIn: 'root'
})
export class DiscountsService {

    calculateDiscountPercent(count: number, product: Product): number {
        let discountItem = product.discounts.find(discount => count >= discount.from && count < discount.to);
        return discountItem ? discountItem.percent : 0;
    }

    calculateDiscountValue(count: number, product: Product): number {
        return count * product.price * (this.calculateDiscountPercent(count, product) / 100);
    }
}
