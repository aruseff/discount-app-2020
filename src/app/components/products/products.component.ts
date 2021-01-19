import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DiscountsDbService } from 'src/app/data/discounts.db.service';
import { ProductsDbService } from 'src/app/data/products.db.service';
import { Discount } from 'src/app/models/discount.model';
import { Product } from 'src/app/models/product.model';
import { ProductComparator } from './products.table.comparator';
import { ProductFilter } from './products.table.filter';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  // Table features
  productFilter = new ProductFilter();
  productComparator = new ProductComparator();

  // New Product
  addProductExpanded: boolean = false;
  newProductName: string = '';
  newProductPrice: number = null;
  addProductNameError: boolean = false;
  addProductPriceError: boolean = false;

  selectedProduct: Product;

  products: Product[] = [];
  discounts: Discount[] = [];

  // New Discount
  newDiscountFrom: number;
  newDiscountTo: number;
  newDiscountPercent: number = 1;
  addDiscountFromError: boolean = false;
  addDiscountToError: boolean = false;
  percents = Array<number>(100).fill(100).map((x, i) => i + 1);

  constructor(
    private productsDbService: ProductsDbService,
    private discountsDbService: DiscountsDbService) { }

  ngOnInit() {
    this.productsDbService.findAllProducts()
      .then(products => this.products = products)
      .catch(error => console.log("Cannot fetch products from DB :: " + error));
  }

  addProduct() {
    if (!this.newProductName || !this.newProductPrice) {
      this.addProductNameError = !this.newProductName;
      this.addProductPriceError = !this.newProductPrice;
    } else {
      this.addProductNameError = false;
      this.addProductPriceError = false;

      let newProduct: Product = {
        name: this.newProductName,
        price: this.newProductPrice
      };

      this.productsDbService.addProduct(newProduct)
        .then(id => {
          newProduct.id = id;
          this.newProductName = '';
          this.newProductPrice = null;
          this.products.push(newProduct);
        })
        .catch(error => console.log("Cannot save product to DB :: " + error));
    }
  }

  deleteProduct(productId) {
    this.selectedProduct = null;
    this.productsDbService.deleteProduct(productId)
      .then(success => {
        let indexToRemove = this.products.findIndex(product => product.id == productId);
        this.products.splice(indexToRemove, 1);
        this.selectedProduct = null;
      })
      .catch(error => console.log("Cannot delete product from DB :: " + error));
  }

  selectProduct(product) {
    this.selectedProduct = product;

    this.discountsDbService.findDiscountsByProductId(this.selectedProduct.id)
      .then(discounts => this.discounts = discounts)
      .catch(error => console.log("Cannot fetch discounts from DB :: " + error));
  }

  addDiscount() {
    if (!this.newDiscountFrom || !this.newDiscountTo) {
      this.addDiscountFromError = !this.newDiscountFrom;
      this.addDiscountToError = !this.newDiscountTo;
    } else if (this.newDiscountFrom >= this.newDiscountTo) {
      this.addDiscountFromError = false;
      this.addDiscountToError = true;
    } else {
      this.addDiscountFromError = false;
      this.addDiscountToError = false;

      let newDiscount: Discount = {
        from: this.newDiscountFrom,
        to: this.newDiscountTo,
        percent: this.newDiscountPercent,
        productId: this.selectedProduct.id
      };

      this.discountsDbService.addDiscount(newDiscount)
        .then(id => {
          newDiscount.id = id;
          this.newDiscountFrom = null;
          this.newDiscountTo = null;
          this.newDiscountPercent = 1;
          this.discounts.push(newDiscount);
        })
        .catch(error => console.log("Cannot save discount to DB :: " + error));

    }

  }

  deleteDiscount(discountId: number) {
    this.discountsDbService.deleteDiscount(discountId)
      .then(success => {
        let indexToRemove = this.discounts.findIndex(discount => discount.id == discountId);
        this.discounts.splice(indexToRemove, 1);
      })
      .catch(error => console.log("Cannot delete discount from DB :: " + error));
  }
}
