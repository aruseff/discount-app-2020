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
  newProduct: Product = {
    name: '',
    price: null
  }
  addProductNameError: boolean = false;
  addProductPriceError: boolean = false;

  deleteProductConfirmation: boolean = false;

  selectedProduct: Product;

  products: Product[] = [];
  discounts: Discount[] = [];

  // New Discount
  newDiscount: Discount = {
    from: null,
    to: null,
    percent: 1,
    productId: null
  }
  addDiscountFromError: boolean = false;
  addDiscountToError: boolean = false;
  percents = Array<number>(100).fill(100).map((x, i) => i + 1);

  constructor(
    private productsDbService: ProductsDbService,
    private discountsDbService: DiscountsDbService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsDbService.findAllProducts()
      .then(products => this.products = products)
      .catch(error => console.log("Cannot fetch products from DB :: " + error));
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price) {
      this.addProductNameError = !this.newProduct.name;
      this.addProductPriceError = !this.newProduct.price;
    } else if (isNaN(this.newProduct.price)) {
      this.addProductNameError = false;
      this.addProductPriceError = true;
    } else {
      this.addProductNameError = false;
      this.addProductPriceError = false;

      this.productsDbService.addProduct(this.newProduct)
        .then(id => {
          this.newProduct.id = id;
          this.products.push(this.newProduct);
          this.newProduct = {
            name: '',
            price: null
          }
        })
        .catch(error => console.log("Cannot save product to DB :: " + error));
    }
  }

  deleteProduct(productId) {
    if (productId) {
      this.selectedProduct = null;
      this.productsDbService.deleteProduct(productId)
        .then(success => {
          let indexToRemove = this.products.findIndex(product => product.id == productId);
          this.products.splice(indexToRemove, 1);
          this.selectedProduct = null;
        })
        .catch(error => console.log("Cannot delete product from DB :: " + error));
    }
  }

  selectProduct(product) {
    this.selectedProduct = product;

    this.discountsDbService.findDiscountsByProductId(this.selectedProduct.id)
      .then(discounts => this.discounts = discounts)
      .catch(error => console.log("Cannot fetch discounts from DB :: " + error));
  }

  addDiscount() {
    if ((!this.newDiscount.from && this.newDiscount.from != 0) || !this.newDiscount.to) {
      this.addDiscountFromError = !this.newDiscount.from;
      this.addDiscountToError = !this.newDiscount.to;
    } else if (this.newDiscount.from >= this.newDiscount.to) {
      this.addDiscountFromError = false;
      this.addDiscountToError = true;
    } else {
      this.addDiscountFromError = false;
      this.addDiscountToError = false;

      this.newDiscount.productId = this.selectedProduct.id;

      this.discountsDbService.addDiscount(this.newDiscount)
        .then(id => {
          this.newDiscount.id = id;
          this.discounts.push(this.newDiscount);
          this.newDiscount = {
            from: null,
            to: null,
            percent: 1,
            productId: null
          }
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
