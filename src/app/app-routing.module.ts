import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { UserGuard } from './guards/user.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { FoodItemFormComponent } from './food-item-form/food-item-form.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FoodItemEditComponent } from './food-item-edit/food-item-edit.component';
import { OtpComponent } from './otp/otp.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { GalleryComponent } from './gallery/gallery.component';

const routes: Routes = [
  { path: '', component : HomeComponent }, 
  { path: 'menu', component: MenuComponent },
  {path:'signup',component:SignupComponent},
  {path:'login',component:LoginComponent},
  { path: 'cart', component: CartComponent, canActivate: [UserGuard] },
  {path:'checkout',component:CheckoutComponent, canActivate: [UserGuard]},
  { path: 'order-summary', component: OrderSummaryComponent, canActivate: [UserGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [UserGuard] }, 
  // {path:'dashboard',component:DashboardComponent, canActivate: [AdminGuard]},
  {path:'create-food-item',component:FoodItemFormComponent},
   {path:'menu-list',component:MenuItemComponent},
   {path:'user-profile',component:UserProfileComponent,canActivate: [UserGuard]},
   { path: 'edit-food-item/:id', component: FoodItemEditComponent },
   { path: 'verify-otp', component: OtpComponent },
   { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
   {path:'aboutus',component:AboutUsComponent},
   {path:'gallery',component:GalleryComponent}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
