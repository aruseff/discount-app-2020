import { Injectable } from "@angular/core";
import { Discount } from "../models/discount.model";
import { DiscountDatabase } from "./database";
import { sqlQueries } from "./sql.queries";

@Injectable({
    providedIn: 'root'
})
export class DiscountsDbService {

    findDiscountsByProductId(productId: number): Promise<Discount[]> {
        const values = { $product_id: productId };

        return DiscountDatabase.selectAll(sqlQueries.select_discounts_by_product_id, values)
            .then((rows) => {
                const discounts: Discount[] = [];
                for (const row of rows) {
                    discounts.push(this.fromRow(row));
                }
                return discounts;
            });
    }

    findAllDiscounts(): Promise<Discount[]> {
        return DiscountDatabase.selectAll(sqlQueries.select_all_discounts, {})
            .then((rows) => {
                const discounts: Discount[] = [];
                for (const row of rows) {
                    discounts.push(this.fromRow(row));
                }
                return discounts;
            });
    }

    public addDiscount(discount: Discount): Promise<number> {
        const values = {
            $from: discount.from,
            $to: discount.to,
            $percent: discount.percent,
            $product_id: discount.productId
        };
        return DiscountDatabase.insert(sqlQueries.insert_discount, values);
    }

    public deleteDiscount(discountId: number): Promise<number> {
        const values = { $id: discountId };
        return DiscountDatabase.delete(sqlQueries.delete_discount, values);
    }

    public fromRow(row: object): Discount {
        return {
            id: row['id'],
            from: row['from'],
            to: row['to'],
            percent: row['percent'],
            productId: row['product_id']
        }
    }

}
