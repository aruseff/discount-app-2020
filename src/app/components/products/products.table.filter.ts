import { ClrDatagridStringFilterInterface } from "@clr/angular";
import { Product } from "src/app/models/product.model";

export class ProductFilter implements ClrDatagridStringFilterInterface<Product> {
    accepts(field: Product, search: string): boolean {
        console.log(search);
        return "" + field.name == search
            || field.name.toLowerCase().indexOf(search) >= 0;
    }
}