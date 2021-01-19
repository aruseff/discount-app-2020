import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { DiscountDatabase } from "./database";
import { sqlQueries } from "./sql.queries";

@Injectable({
    providedIn: 'root'
})
export class ProductsDbService {

    findAllProducts(): Promise<Product[]> {
        const values = {};
        return DiscountDatabase.selectAll(sqlQueries.select_all_products, values)
            .then((rows) => {
                const products: Product[] = [];
                for (const row of rows) {
                    products.push(this.fromRow(row));
                }
                return products;
            });
    }

    public addProduct(product: Product): Promise<number> {
        const values = {
            $name: product.name,
            $price: product.price
        };
        return DiscountDatabase.insert(sqlQueries.insert_product, values);
    }

    public deleteProduct(productId: number): Promise<number> {
        const discountValues = { $product_id: productId };
        return DiscountDatabase.delete(sqlQueries.delete_discounts_by_product_id, discountValues)
        .then(success => {
            const productValues = { $id: productId };
            return DiscountDatabase.delete(sqlQueries.delete_product, productValues);
        });
    }

    fromRow(row: object): Product {
        return {
            id: row['id'],
            name: row['name'],
            price: row['price']
        }
    }
}
