import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductsDbService } from 'src/app/data/products.db.service';
// import { UUID } from 'angular2-uuid';
// import { ProductsFileService } from 'src/app/data/products.file.service';
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
  newProductPrice: number = 0;
  addProductNameError: boolean = false;
  addProductPriceError: boolean = false;

  selectedProduct: Product;

  products: Product[] = [];

  constructor(
    private productsDbService: ProductsDbService) { }

  ngOnInit() {
    this.products = this.productsDbService.findAllProducts();
  }

  addProduct() {
    if (!this.newProductName || !this.newProductPrice) {
      this.addProductNameError = !this.newProductName;
      this.addProductPriceError = !this.newProductPrice;
    } else {
      this.addProductNameError = false;
      this.addProductPriceError = false;

      const newProducts = this.products.map(product => Object.assign({}, product));
      // newProducts.push({
      //   id: UUID.UUID(),
      //   name: this.newProductName,
      //   price: this.newProductPrice
      // });

      // if (this.productsFileService.saveProducts(newProducts)) {
      //   this.products = newProducts;
      //   this.newProductName = '';
      //   this.newProductPrice = 0;
      // }
    }
  }

  deleteClub(productId) {
    this.selectedProduct = null;
    const newProducts = this.products.map(product => Object.assign({}, product));
    let indexToRemove = newProducts.findIndex(product => product.id == productId);
    newProducts.splice(indexToRemove, 1);
    // if (this.productsFileService.saveProducts(newProducts)) {
    //   this.products = newProducts;
    // }
  }

  selectProduct(product) {
    this.selectedProduct = product;
  }
}
