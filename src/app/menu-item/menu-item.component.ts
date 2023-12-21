import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { FoodCategory } from '../models/food-category';
import { FoodItem } from '../models/food-item';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  foodItems: FoodItem[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private menuService: MenuService,private router: Router,private logService:LogService) { }

  ngOnInit() {
    this.getFoodItems();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getBase64Image(base64String: string): string {
    console.log(environment.userProfileFields.base64Prefix + base64String);
    return environment.userProfileFields.base64Prefix + base64String;
  }
  
  getFoodItems() {
    this.menuService.getAllFoodItems()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (foodItems: FoodCategory[]) => {
          this.foodItems = foodItems.flatMap(category => category.items);
        },
        (error) => {
          this.logService.logErrorWithDetails(environment.messages.menuFetchFailure, error);
        }
      );
  }
  navigateToFoodItemForm() {
    this.router.navigate([environment.routes.addFoodItem]);
  }

  addMenuItem() {
  }

  editMenuItem(foodItem: FoodItem) {
    this.router.navigate([environment.routes.editFoodItem, foodItem.id]);
  }

  deleteMenuItem(foodItem: FoodItem) {
    this.menuService.deleteFoodItem(foodItem.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response: any) => {
          console.log(response);
          // Refresh the food items list
          this.getFoodItems();
        },
        (error: any) => {
          this.logService.logErrorWithDetails(environment.messages.deleteFoodItemError, error);
        }
      );
  }
}
