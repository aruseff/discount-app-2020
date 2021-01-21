import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ClubsComponent } from './components/clubs/clubs.component';
import { ProductsComponent } from './components/products/products.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClubsDbService } from './data/clubs.db.service';
import { ProductsDbService } from './data/products.db.service';
import { DiscountsDbService } from './data/discounts.db.service';
import { DatePipe } from '@angular/common';
import { PurchasesDbService } from './data/purchases.db.service';
import { DiscountsService } from './services/discount.service';
import { StatsComponent } from './components/stats/stats.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        ClarityModule,
        BrowserAnimationsModule,
    ],
    declarations: [
        AppComponent,
        ClubsComponent,
        ProductsComponent,
        StatsComponent
    ],
    providers: [ClubsDbService, ProductsDbService, DiscountsDbService, PurchasesDbService, DiscountsService, DatePipe],
    bootstrap: [
        AppComponent,
    ],
})

export class AppModule {
}
