import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClubsComponent } from './components/clubs/clubs.component';
import { ProductsComponent } from './components/products/products.component';
import { StatsComponent } from './components/stats/stats.component';

const routes: Routes = [
  { path: 'clubs', component: ClubsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'stats', component: StatsComponent },
  { path: '', redirectTo: 'clubs', pathMatch: 'full' },
  { path: '**', redirectTo: 'clubs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
