import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { MatIconModule } from '@angular/material/icon'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeContactsComponent } from './pages/home/home-contacts/home-contacts.component';
import { HomeServicesComponent } from './pages/home/home-services/home-services.component';
import { HomeMainComponent } from './pages/home/home-main/home-main.component';
import { HomeFeedbackComponent } from './pages/home/home-feedback/home-feedback.component';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './preloader-config';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { BasketComponent } from './pages/basket/basket.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CategoryPipe } from './shared/pipes/category.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatBadgeModule } from '@angular/material/badge';
import { HomeGuestsComponent } from './pages/home/home-guests/home-guests.component';
import { AdminGuestsComponent } from './admin/admin-guests/admin-guests.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { AdminBlacklistComponent } from './admin/admin-blacklist/admin-blacklist.component';
import { AdminFeedbackComponent } from './admin/admin-feedback/admin-feedback.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { FeedbackHomeComponent } from './pages/feedback/feedback-home/feedback-home.component';
import { FeedbackAuthorizationComponent } from './pages/feedback/feedback-authorization/feedback-authorization.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { AdminArchiveComponent } from './admin/admin-archive/admin-archive.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MenuComponent,
    ContactsComponent,
    AdminComponent,
    AdminCategoriesComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    HomeContactsComponent,
    HomeServicesComponent,
    HomeMainComponent,
    HomeFeedbackComponent,
    BasketComponent,
    CategoryPipe,
    HomeGuestsComponent,
    AdminGuestsComponent,
    ProductDetailsComponent,
    PaginatorComponent,
    AdminBlacklistComponent,
    AdminFeedbackComponent,
    FeedbackComponent,
    FeedbackHomeComponent,
    FeedbackAuthorizationComponent,
    AdminArchiveComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    FontAwesomeModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    AngularFireModule.initializeApp(environment.firebase, 'pizza'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TextMaskModule,
    MatDialogModule,
    ModalModule.forRoot(),
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MatBadgeModule,
    MatSelectModule,
    PaginationModule.forRoot(),
    MatCheckboxModule,
    AccordionModule.forRoot(),
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule,
    SimpleNotificationsModule.forRoot(),
    MatRippleModule

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
