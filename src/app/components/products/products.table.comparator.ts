import { ClrDatagridComparatorInterface } from "@clr/angular";
import { Product } from "src/app/models/product.model";

export class ProductComparator implements ClrDatagridComparatorInterface<Product> {
    compare(a: Product, b: Product) {
        return a.name.localeCompare(b.name);
    }
}
