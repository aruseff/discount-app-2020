import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class DiscountsService {

    // discounts: Discount[] = [];

    // constructor(private discountsFileService: DiscountsFileService) {
    //     this.discounts = this.discountsFileService.findAllDiscounts();
    // }

    calculateDiscountPercent(count: number): number {
        // let discountItem = this.discounts.find(discount => discount.from < count && discount.to >= count);
        // return discountItem ? discountItem.percent : 0;
        return 0;
    }

    calculateDiscountValue(count, productPrice): number {
        // return count * productPrice * (this.calculateDiscountPercent(count) / 100);
        return 0;
    }

}
