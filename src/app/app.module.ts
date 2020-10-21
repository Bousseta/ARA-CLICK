import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestoListComponent} from "./serveur-list/resto-list.component";
import { SingleRestaurantComponent } from './restaurant-list/single-restaurant/single-restaurant.component';
import { RestaurantFormComponent } from './restaurant-list/restaurant-form/restaurant-form.component';
import { HeaderComponent } from './header/header.component';
import {AuthService} from "./services/auth.service";
import {RestaurantsService} from "./services/restaurants.service";
import {AuthGuardService} from "./services/auth-guard.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {AgmCoreModule} from '@agm/core';
import {MapsService} from "./services/maps.service";
import { SingleCategorieComponent } from './categories/single-categorie/single-categorie.component';
import { CategorieFormComponent } from './categories/categorie-form/categorie-form.component';
import {CategoriesService} from "./services/categories.service";
import { PlatFormComponent } from './plats/plat-form/plat-form.component';
import { SinglePlatComponent } from './plats/single-plat/single-plat.component';
import {PlatsService} from "./services/plats.service";
import { ServeurListComponent } from './serveur-list/serveur-list.component';
import { ServeurFormComponent } from './serveur-list/serveur-form/serveur-form.component';
import { SingleServeurComponent } from './serveur-list/single-serveur/single-serveur.component';
import {ServeursService} from "./services/serveurs.service";
import {NgxQRCodeComponent, NgxQRCodeModule} from "ngx-qrcode2/index";
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import {environment} from "../environments/environment";
import { AngularFireAuth } from '@angular/fire/auth';
import {TranslateModule} from "@ngx-translate/core";
import {NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {StatModule} from "./shared/modules";
import {ChatComponent, NotificationComponent, TimelineComponent} from "./dashboard/components";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ProfilComponent } from './profil/profil.component';
import {ProfilService} from "./services/profil.service";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {ChartsComponent} from "./charts/charts.component";
import {ChartsModule} from "ng2-charts";
import {PageHeaderComponent} from "./shared/modules/page-header/page-header.component";
import {CommonModule} from "@angular/common";
import {QrcodeComponent} from "./qrcode/qrcode.component";
import {PdfComponent} from "./qrcode/pdf/pdf.component";
import { RestaurantComponent } from './restaurant/restaurant.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent},
  { path: 'auth/signin', component: SigninComponent},
  { path: 'profil/:id', component:ProfilComponent},
  { path: 'charts', component: ChartsComponent},
  { path: 'qrcode', component: QrcodeComponent},
  { path: 'pdf/:id', component: PdfComponent},
  { path: 'restaurant', component: RestaurantComponent},
  { path: 'restaurants', canActivate: [AuthGuardService], component: RestaurantListComponent},
  { path: 'resto', canActivate: [AuthGuardService], component: RestoListComponent},
  { path: 'restaurants/new', canActivate: [AuthGuardService], component: RestaurantFormComponent},
  { path: 'restaurants/view/:id', canActivate: [AuthGuardService], component: SingleRestaurantComponent},
  { path: 'categories/new/:id', canActivate: [AuthGuardService], component: CategorieFormComponent },
  { path: 'categories/view/:id', canActivate: [AuthGuardService], component: SingleCategorieComponent},
  { path: 'plats/new/:id', canActivate: [AuthGuardService], component: PlatFormComponent},
  { path: 'plats/view/:id', canActivate: [AuthGuardService], component: SinglePlatComponent},
  { path: 'resto/view/:id', canActivate: [AuthGuardService], component: ServeurListComponent},
  { path: 'serveurs/new', canActivate: [AuthGuardService], component: ServeurFormComponent},
  { path: 'serveurs/view/:id', canActivate: [AuthGuardService], component: SingleServeurComponent},
  { path: 'customers', canActivate: [AuthGuardService], component: CustomersListComponent},
  { path: 'customers/new', canActivate: [AuthGuardService], component: CreateCustomerComponent},
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: '**', redirectTo: 'restaurants' }
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    RestaurantListComponent,
    SingleRestaurantComponent,
    RestaurantFormComponent,
    HeaderComponent,
    DashboardComponent,
    RestaurantListComponent,
    SingleCategorieComponent,
    CategorieFormComponent,
    PlatFormComponent,
    ChartsComponent,
    SinglePlatComponent,
    ServeurListComponent,
    RestoListComponent,
    ServeurFormComponent,
    SingleServeurComponent,
    PageHeaderComponent,
    CustomerDetailsComponent,
    CustomersListComponent,
    CreateCustomerComponent,
    SidebarComponent,
    DashboardComponent,
    TimelineComponent,
    NotificationComponent,
    ChatComponent,
    ProfilComponent,
    PdfComponent,
    QrcodeComponent,
    RestaurantComponent,
    VerifyEmailComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    HttpClientModule,
    NgbCarouselModule.forRoot(),
    NgbDropdownModule.forRoot(),
    NgbAlertModule.forRoot(),
    StatModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    LanguageTranslationModule,
    NgbPaginationModule.forRoot(),

    RouterModule.forRoot(appRoutes),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-VkC8x8NQzSd2sfHJkvMH1KLARBn-xGM'
    }),
    TranslateModule

  ],
  providers: [
      AuthService,
      ProfilService,
      RestaurantsService,
      AuthGuardService,
      MapsService,
      CategoriesService,
      PlatsService,
      ServeursService,
      AngularFireAuth
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
