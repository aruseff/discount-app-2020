import { Injectable } from "@angular/core";
import { Purchase } from "../models/purchase.model";
import { DiscountDatabase } from "./database";
import { sqlQueries } from "./sql.queries";

@Injectable({
    providedIn: 'root'
})
export class PurchasesDbService {

    findAllPurchases(): Promise<Purchase[]> {
        const values = {};
        return DiscountDatabase.selectAll(sqlQueries.select_purchases, values)
            .then((rows) => {
                const purchases: Purchase[] = [];
                for (let row of rows) {
                    let product = this.fromRow(row);
                    purchases.push(product);
                }
                return purchases;
            });
    }

    findAllPurchasesByDate(fromDate: string, toDate: string): Promise<Purchase[]> {
        const values = {
            $from_date: fromDate,
            $to_date: toDate
        };
        return DiscountDatabase.selectAll(sqlQueries.select_purchases_by_date_range, values)
            .then((rows) => {
                const purchases: Purchase[] = [];
                for (let row of rows) {
                    let product = this.fromRow(row);
                    purchases.push(product);
                }
                return purchases;
            });
    }

    findAllPurchasesByClubId(clubId: number): Promise<Purchase[]> {
        const values = { $club_id: clubId };
        return DiscountDatabase.selectAll(sqlQueries.select_purchases_by_club_id, values)
            .then((rows) => {
                const purchases: Purchase[] = [];
                for (let row of rows) {
                    let product = this.fromRow(row);
                    purchases.push(product);
                }
                return purchases;
            });
    }

    public addPurchase(purchase: Purchase): Promise<number> {
        const values = {
            $club_id: purchase.clubId,
            $product_id: purchase.productId,
            $quantity: purchase.quantity,
            $date: purchase.date
        };
        return DiscountDatabase.insert(sqlQueries.insert_purchase, values);
    }

    public deletePurchase(purchaseId: number): Promise<number> {
        const values = { $id: purchaseId };
        return DiscountDatabase.delete(sqlQueries.delete_purchase, values);
    }

    public fromRow(row: object): Purchase {
        return {
            id: row['id'],
            clubId: row['club_id'],
            productId: row['product_id'],
            quantity: row['quantity'],
            date: row['date']
        };
    }

}
