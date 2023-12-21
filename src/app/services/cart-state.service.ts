import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  public cartCount$: Observable<number>; 

  constructor(private cartService: CartService) {
    this.cartService.cartItems$.subscribe((cartItems) => {
      this.cartItemsSubject.next(cartItems);
    });
    this.cartCount$ = this.cartItemsSubject.pipe(map((items) => this.calculateCartCount(items)));
  }

  addToCart(cartItem: CartItem): void {
    this.cartService.addToCart(cartItem).subscribe(
      () => {
        const currentCartItems = this.cartItemsSubject.getValue();
        const updatedCartItems = [...currentCartItems, cartItem];
        this.cartItemsSubject.next(updatedCartItems);
      },
      (error) => {
        console.log( error);
      }
    );
  }

  increaseQuantity(itemId: number): void {
    const currentCartItems = this.cartItemsSubject.getValue();
    const updatedCartItems = currentCartItems.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity: item.quantity + 1, totalAmount: item.price * (item.quantity + 1) };
        this.cartService.increaseQuantity(itemId).subscribe(
          () => {
          },
          (error) => {
            console.log( error);
          }
        );
        return updatedItem;
      }
      return item;
    });
    this.cartItemsSubject.next(updatedCartItems);
  }

  decreaseQuantity(itemId: number): void {
    const currentCartItems = this.cartItemsSubject.getValue();
    const updatedCartItems = currentCartItems.filter((item) => {
      if (item.id === itemId) {
        if (item.quantity > 1) {
          const updatedItem = { ...item, quantity: item.quantity - 1, totalAmount: item.price * (item.quantity - 1) };
          this.cartService.decreaseQuantity(itemId).subscribe(
            () => {
            },
            (error) => {
              console.log( error);
            }
          );
          return true; 
        } else {
          return false;
        }
      }
      return true; 
    });
    this.cartItemsSubject.next(updatedCartItems);
  }
  

  removeCartItem(itemId: number): void {
    this.cartService.removeCartItem(itemId).subscribe(
      () => {
        const currentCartItems = this.cartItemsSubject.getValue();
        const updatedCartItems = currentCartItems.filter((item) => item.id !== itemId);
        this.cartItemsSubject.next(updatedCartItems);
      },
      (error) => {
        console.log( error);
      }
    );
  }
  
  getCartItemByName(itemName: string): CartItem | undefined {
    const currentCartItems = this.cartItemsSubject.getValue();
    return currentCartItems.find((item) => item.name === itemName);
  }

  calculateTotalAmount(): number {
    const cartItems = this.cartItemsSubject.getValue();
    return cartItems.reduce((total, item) => total + (item.totalAmount ?? 0), 0);
  }
  private calculateCartCount(items: CartItem[]): number {
    const uniqueItems = new Set(items.map((item) => item.name));
    return uniqueItems.size;
  }
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
  clearCart() {
    this.cartItemsSubject.next([]); 
    this.cartCount$ = this.cartItemsSubject.pipe(map((items) => this.calculateCartCount(items)));
  }
  
  
  
}
