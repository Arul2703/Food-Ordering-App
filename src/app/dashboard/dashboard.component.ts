import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  foodItemCount: number;
  orderCount: number;
  paymentCount: number;
  userCount: number;

  constructor(private router: Router) {
    const counts = environment.dashboardCounts;
    this.foodItemCount = counts.foodItemCount;
    this.orderCount = counts.orderCount;
    this.paymentCount = counts.paymentCount;
    this.userCount = counts.userCount;
  }

  showMenuItem() {
    this.router.navigate([environment.routes.menuList]);
  }
}
