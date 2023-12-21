import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { UserGuard } from '../guards/user.guard';
import { AdminGuard } from '../guards/admin.guard';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      // Define child routes for admin section
      // For example:
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'orders', component: OrdersComponent },
      {path:'dashboard',component:DashboardComponent, canActivate: [AdminGuard]},
      {path:'orders',component:OrdersComponent, canActivate: [AdminGuard]}

      // ...
    ],
    canActivate:[AdminGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
