import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { UserModel } from '../models/signup-model.model';
import { AuthService } from '../services/auth.service';
import { CartStateService } from '../services/cart-state.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  currentUser: UserModel | null = null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private cartStateService: CartStateService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private logService : LogService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cartStateService.cartItems$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (cartItems: CartItem[]) => {
          this.cartItems = cartItems;
          this.changeDetectorRef.detectChanges(); // Trigger change detection
        },
        (error: any) => {
          this.logService.logErrorWithDetails(environment.messages.cartFetchFailure, error);
        }
      );
    this.fetchCartItems();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  incrementQuantity(cartItem: CartItem): void {
    this.cartStateService.increaseQuantity(cartItem.id);
  }

  decrementQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.cartStateService.decreaseQuantity(cartItem.id);
    } else {
      this.removeItem(cartItem);
    }
  }
  getBase64Image(base64String: string): string {
    console.log(this.cartItems);
    
    return environment.userProfileFields.base64Prefix + base64String;
  }

  removeItem(cartItem: CartItem): void {
    this.cartStateService.removeCartItem(cartItem.id);
  }
  goToCheckout() {
    this.router.navigate([environment.routes.checkout]);
  }

  // getTotalBill(): number {
  //   return this.cartItems.reduce((total, item) => total + item.bill, 0);
  // }
  getTotalBill(): number {
  return this.cartItems.reduce((total, item) => total + (item.totalAmount ?? 0), 0);
}

  

  fetchCartItems(): void {
    
  }
}
