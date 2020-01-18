import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { BasketComponent } from './pages/basket/basket.component';
import { AdminGuestsComponent } from './admin/admin-guests/admin-guests.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { AdminBlacklistComponent } from './admin/admin-blacklist/admin-blacklist.component';
import { AdminFeedbackComponent } from './admin/admin-feedback/admin-feedback.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { FeedbackHomeComponent } from './pages/feedback/feedback-home/feedback-home.component';
import { FeedbackAuthorizationComponent } from './pages/feedback/feedback-authorization/feedback-authorization.component';
import { AdminArchiveComponent } from './admin/admin-archive/admin-archive.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'menu/:category', component: MenuComponent },
  { path: 'menu/:category/:name', component: ProductDetailsComponent },
  {
    path: 'feedback', component: FeedbackComponent, children: [
      { path: '', redirectTo: 'authorization', pathMatch: 'full' },
      { path: 'authorization', component: FeedbackAuthorizationComponent },
      { path: 'home', component: FeedbackHomeComponent },
    ]
  },
  { path: 'contacts', component: ContactsComponent },
  { path: 'basket', component: BasketComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'products/:category', component: AdminProductsComponent },
      { path: 'feedback', component: AdminFeedbackComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'blacklist', component: AdminBlacklistComponent },
      { path: 'guests', component: AdminGuestsComponent },
      { path: 'archive', component: AdminArchiveComponent },
    ]
  },

  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
