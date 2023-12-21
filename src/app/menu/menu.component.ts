import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MenuService } from '../services/menu.service';
import { FoodCategory } from '../models/food-category';
import { FoodItem } from '../models/food-item';
import { CategoryFilterPipe } from '../category-filter.pipe';
import { CartStateService } from '../services/cart-state.service';3
import { CartItem } from '../models/cart-item';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [CategoryFilterPipe] 
})
export class MenuComponent implements OnInit {
  foodCategories: FoodCategory[] = [];
  selectedCategory: string = environment.defaultFoodCategory;
  userId: number | undefined;
  cartId = environment.cartDefaults.cartId;
  cartQuantity = environment.cartDefaults.cartQuantity;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private categoryFilterPipe: CategoryFilterPipe, 
    private cartStateService: CartStateService, 
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.menuService.getAllFoodItems()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: FoodCategory[]) => {
          this.foodCategories = data;
          console.log(data);
        },
        (error) => {
          console.log(environment.messages.menuFetchFailure, error);
        }
      );
  }
  getBase64Image(base64String: string): string {
    return environment.userProfileFields.base64Prefix + base64String;
  }
  

  isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }

  addToCart(foodItem: FoodItem): void {
    const currentUser = this.authService.getCurrentUser();

    if (this.authService.getToken()) {
      const existingCartItem = this.cartStateService.getCartItemByName(foodItem.name);
      if (existingCartItem) {
  
        this.cartStateService.increaseQuantity(existingCartItem.id);
      } else {
        const userId = currentUser?.userId;
          const newCartItem = new CartItem(
            this.cartId,
            foodItem.name,
            foodItem.imageUrl,
            foodItem.price,
            this.cartQuantity,
            foodItem.price,
            foodItem.id,
            userId 
          );
          this.cartStateService.addToCart(newCartItem);
      }
    } else {
      this.router.navigate([environment.routes.login]);
    }
  }
  
  filterItems(category: string) {
    this.selectedCategory = category;
  }

  flattenFoodItems(): FoodItem[] {
    // Flatten your food items array to get a single array of all food items
    return this.foodCategories.flatMap(category => category.items);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
