import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClubsDbService } from 'src/app/data/clubs.db.service';
import { DiscountsDbService } from 'src/app/data/discounts.db.service';
import { ProductsDbService } from 'src/app/data/products.db.service';
import { PurchasesDbService } from 'src/app/data/purchases.db.service';
import { Discount } from 'src/app/models/discount.model';
import { Purchase } from 'src/app/models/purchase.model';
import { constants } from 'src/app/utils/constants';
import { Club } from '../../models/club.model';
import { Product } from '../../models/product.model';
import { DiscountsService } from '../../services/discount.service';
import { ClubComparator } from './clubs.table.comparator';
import { ClubFilter } from './clubs.table.filter';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClubsComponent implements OnInit {

  // Table features
  clubFilter = new ClubFilter();
  clubComparator = new ClubComparator();

  // New Club
  addClubExpanded: boolean = false;
  newClub: Club = {
    name: '',
    chairman: ''
  };
  addClubNameError: boolean = false;
  addClubChairmanError: boolean = false;

  deleteClubConfirmation: boolean = false;

  // New Order
  newOrderProductId: number = -1;
  newOrderCount: number = 0;

  selectedClub: Club;
  clubs: Club[] = [];
  products: Product[] = [];
  purchases: Purchase[] = [];

  constructor(
    private clubsDbService: ClubsDbService,
    private productsDbService: ProductsDbService,
    private discountsDbService: DiscountsDbService,
    private purchaseDbService: PurchasesDbService,
    private datePipe: DatePipe,
    private discountsService: DiscountsService) { }

  ngOnInit() {
    this.loadAllClubs();
    this.loadProductsWithDiscounts();
  }

  loadAllClubs() {
    this.clubsDbService.findAllClubs()
      .then(clubs => this.clubs = clubs)
      .catch(error => console.log("Cannot fetch clubs from DB :: " + error));
  }

  loadProductsWithDiscounts() {
    this.productsDbService.findAllProducts()
      .then(products => {
        this.products = products;
        this.discountsDbService.findAllDiscounts()
          .then(discounts => this.mapDiscountsToProducts(discounts))
          .catch(error => console.log("Cannot fetch discounts from DB :: " + error));
      })
      .catch(error => console.log("Cannot fetch products from DB :: " + error));
  }

  loadPurchases() {
    this.purchaseDbService.findAllPurchasesByClubId(this.selectedClub.id)
      .then(purchases => this.purchases = purchases)
      .catch(error => console.log("Cannot fetch purchases for club from DB ::" + error));
  }

  mapDiscountsToProducts(allDiscounts: Discount[]): any {
    this.products.forEach(product => {
      product.discounts = allDiscounts.filter(discount => discount.productId == product.id);
    });
  }

  addClub() {
    if (!this.newClub.name || !this.newClub.chairman) {
      this.addClubNameError = !this.newClub.name;
      this.addClubChairmanError = !this.newClub.chairman;
    } else {
      this.addClubNameError = false;
      this.addClubChairmanError = false;

      this.clubsDbService.addClub(this.newClub)
        .then(id => {
          this.newClub.id = id;
          this.clubs.push(this.newClub);
          this.newClub = {
            name: '',
            chairman: ''
          };
        })
        .catch(error => console.log("Cannot save club to DB :: " + error));
    }
  }

  deleteClub(clubId) {
    if (clubId) {
      this.selectedClub = null;
      this.clubsDbService.deleteClub(clubId)
        .then(success => {
          let indexToRemove = this.clubs.findIndex(club => club.id == clubId);
          this.clubs.splice(indexToRemove, 1);
          this.selectedClub = null;
        })
        .catch(error => console.log("Cannot delete club from DB :: " + error));
    }
  }

  selectClub(club) {
    this.selectedClub = club;
    this.loadPurchases();
  }

  getPurchasesCount(product: Product) {
    let purchase = this.purchases.find(purchase => purchase.productId == product.id);
    return purchase ? purchase.quantity : 0;
  }

  calculateDiscountValue(product: Product) {
    let purchase = this.purchases.find(purchase => purchase.productId == product.id);
    return this.discountsService.calculateDiscountValue(purchase ? purchase.quantity : 0, product);
  }

  calculateDiscountPercent(product: Product) {
    let purchase = this.purchases.find(purchase => purchase.productId == product.id);
    return this.discountsService.calculateDiscountPercent(purchase ? purchase.quantity : 0, product);
  }

  addNewOrder() {
    if (this.newOrderProductId != -1 && this.newOrderCount > 0) {
      let newPurchase: Purchase = {
        clubId: this.selectedClub.id,
        productId: this.newOrderProductId,
        quantity: this.newOrderCount,
        date: this.datePipe.transform(new Date(), constants.dateFormat)
      }
      this.purchaseDbService.addPurchase(newPurchase)
        .then(id => {
          newPurchase.id = id;
          this.purchases.push(newPurchase);
          this.loadPurchases();
          this.newOrderProductId = -1;
          this.newOrderCount = 0;
        })
        .catch(error => console.log("Cannot save purchase in DB :: " + error));
    }
  }

}
