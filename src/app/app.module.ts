import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ClubsComponent } from './components/clubs/clubs.component';
import { ProductsComponent } from './components/products/products.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        ProductsComponent
    ],
    providers: [
    ],
    bootstrap: [
        AppComponent,
    ],
})

export class AppModule {
}
