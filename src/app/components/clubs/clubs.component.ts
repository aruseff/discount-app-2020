import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { UUID } from 'angular2-uuid';
import { ClubsDbService } from 'src/app/data/clubs.db.service';
import { DiscountsDbService } from 'src/app/data/discounts.db.service';
import { ProductsDbService } from 'src/app/data/products.db.service';
import { Club } from '../../models/club.model';
import { Product } from '../../models/product.model';
import { DiscountsService } from '../services/discount.service';
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
  newClubName: string = '';
  newClubChairman: string = '';
  addClubNameError: boolean = false;
  addClubChairmanError: boolean = false;

  // New Order
  newOrderProduct: Product = null;
  newOrderCount: number = 0;
  selectedClub: Club;

  clubs: Club[] = [];
  products: Product[] = [];

  constructor(
    private clubsDbService: ClubsDbService,
    private productsDbService: ProductsDbService,
    private discountsDbService: DiscountsDbService,
    private discountsService: DiscountsService) { }

  ngOnInit() {
    this.products = this.productsDbService.findAllProducts();
    this.clubs = this.clubsDbService.findAllClubs();
    this.newOrderProduct = this.products.length > 0 ? this.products[0] : null;
  }

  addClub() {
    if (!this.newClubName || !this.newClubChairman) {
      this.addClubNameError = !this.newClubName;
      this.addClubChairmanError = !this.newClubChairman;
    } else {
      this.addClubNameError = false;
      this.addClubChairmanError = false;

      const newClubs = this.clubs.map(club => Object.assign({}, club));
      // newClubs.push({
      //   id: "TODO",
      //   name: this.newClubName,
      //   chairman: this.newClubChairman,
      //   purchases: 0
      // });

      // if (this.clubsFileService.saveClubs(newClubs)) {
      //   this.clubs = newClubs;
      //   this.newClubName = '';
      //   this.newClubChairman = '';
      // }
    }
  }

  deleteClub(clubId) {
    this.selectedClub = null;
    const newClubs = this.clubs.map(club => Object.assign({}, club));
    let indexToRemove = newClubs.findIndex(club => club.id == clubId);
    newClubs.splice(indexToRemove, 1);
    // if (this.clubsFileService.saveClubs(newClubs)) {
    //   this.clubs = newClubs;
    // }
  }

  selectClub(club) {
    this.selectedClub = club;
  }

  calculateDiscountValue(club: Club, product: Product) {
    return this.discountsService.calculateDiscountValue(club.purchases, product.price);
  }

  calculateDiscountPercent(club: Club) {
    return this.discountsService.calculateDiscountPercent(club.purchases);
  }

  addNewOrder() {
    if (this.newOrderProduct && this.newOrderCount > 0) {
      this.selectedClub.purchases += this.newOrderCount;
      this.newOrderCount = 0;
      // this.clubsFileService.saveClubs(this.clubs);
    }
  }

  removeNewOrder() {
    if (this.newOrderProduct && this.newOrderCount > 0) {
      if (this.selectedClub.purchases - this.newOrderCount < 0) {
        this.selectedClub.purchases = 0;
      } else {
        this.selectedClub.purchases -= this.newOrderCount;
      }
      this.newOrderCount = 0;
      // this.clubsFileService.saveClubs(this.clubs);
    }
  }

}
