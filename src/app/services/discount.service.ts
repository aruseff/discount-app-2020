import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';


@Injectable({
    providedIn: 'root'
})
export class DiscountsService {

    calculateDiscountPercent(count: number, product: Product): number {
        let discountItem = product.discounts.find(discount => count > discount.from && count <= discount.to);
        return discountItem ? discountItem.percent : 0;
    }

    calculateDiscountValue(count: number, product: Product): any {

        let result: any = {
            steps: [],
            total: 0,
        };

        if (count <= 0) {
            return result;
        }

        if (product.discounts) {
            product.discounts.forEach(currentDiscount => {
                let currentCount: number = 0;
                if (count > currentDiscount.to) {
                    currentCount = currentDiscount.to - currentDiscount.from;
                } else if (count > currentDiscount.from) {
                    currentCount = count - currentDiscount.from;
                } else {
                    currentCount = 0;
                }
                let value = this.calculateValue(currentCount, currentDiscount.percent, product.price);
                result.steps.push({ count: currentCount, percent: currentDiscount.percent, value: value });
                result.total += value;
            });
        }
        return result;
    }

    calculateValue(count: number, percent: number, price: number) {
        return count * price * (percent / 100);
    }
}
