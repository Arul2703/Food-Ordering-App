import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuComponent } from './menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CategoryFilterPipe } from './category-filter.pipe';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodItemFormComponent } from './food-item-form/food-item-form.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ToastrModule } from 'ngx-toastr';
import { FoodItemEditComponent } from './food-item-edit/food-item-edit.component';
import { OtpComponent } from './otp/otp.component';
import { FooterComponent } from './footer/footer.component';
import {LoggerModule,NgxLoggerLevel} from 'ngx-logger';
import {environment} from 'src/environments/environment';
import { AdminModule } from './admin/admin.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { GalleryComponent } from './gallery/gallery.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuComponent,
    SignupComponent,
    LoginComponent,
    CategoryFilterPipe,
    CartComponent,
    HomeComponent,
    CheckoutComponent,
    OrderSummaryComponent,
    OrderHistoryComponent,
    DashboardComponent,
    FoodItemFormComponent,
    MenuItemComponent,
    UserProfileComponent,
    FoodItemEditComponent,
    OtpComponent,
    FooterComponent,
    AboutUsComponent,
    GalleryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AdminModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LoggerModule.forRoot({ level: NgxLoggerLevel[environment.logLevel as keyof typeof NgxLoggerLevel] })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
