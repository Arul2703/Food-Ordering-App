import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CheckoutModel } from '../models/checkout-model';
import { CheckoutService } from '../services/checkout.service';
import { CartStateService } from '../services/cart-state.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {environment} from 'src/environments/environment';
import { LogService } from '../services/log.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  orderId!: string;
  model: CheckoutModel;
  errorMessage: string | null = null;
  orderSummary: any | null = null;
  paymentStatus: string | null = null;
  private unsubscribe$ = new Subject<void>();


  constructor(private formBuilder: FormBuilder, private http: HttpClient, private checkoutService: CheckoutService,private cartStateService: CartStateService,public authService: AuthService,private router: Router,private logService:LogService) {
    this.model = new CheckoutModel();
    this.checkoutForm = this.formBuilder.group(CheckoutModel.getValidationRules());
  }

  onSubmit() {
    console.log("submitted");
    if (this.checkoutForm.valid) {
      try {
        this.processCheckout();
      } catch (error) {
        this.logService.logErrorWithDetails(environment.messages.checkoutFailure, error);
      }
    } else {
      const formIsPristine = Object.keys(this.checkoutForm.controls).every(key => {
        const control = this.checkoutForm.get(key);
        return control?.pristine; // Check if the control is pristine
      });
  
      if (formIsPristine) {
        this.checkoutForm.markAllAsTouched();
        console.log(this.errorMessage);
      } else {
        this.checkoutForm.markAllAsTouched();
      }
    }
  }

  processCheckout() {
    const checkoutFormValue = this.checkoutForm.value;
    const cartItems = this.cartStateService.getCartItems();
    this.checkoutService.checkout(checkoutFormValue, cartItems)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          this.orderId = data.orderId;
          this.initiateRazorpayPayment();
        },
        (error: any) => {
          this.logService.logErrorWithDetails(environment.messages.checkoutFailure, error);
        }
      );
  }

  initiateRazorpayPayment() {
    const options = {
      key: environment.razorpay.key,
      amount: this.cartStateService.calculateTotalAmount() * environment.razorpay.amountMultiplier,
      currency: environment.razorpay.currency,
      name: environment.razorpay.restaurantName,
      description: environment.razorpay.orderDescription,
      image: environment.razorpay.imageUrl,
      order_id: this.orderId,
      handler: (response: any) => {
        this.makePayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
      },
      prefill: {
        name: this.checkoutForm.value.name,
        email: this.checkoutForm.value.email,
        contact: this.checkoutForm.value.mobileNumber
      },
      notes: {
        address: this.checkoutForm.value.address,
        pincode: this.checkoutForm.value.pinCode
      }
    };

    const razorpayWindow = (window as any).Razorpay;
    const instance = new razorpayWindow(options);
    instance.open();
  }

  makePayment(paymentId: string, orderId: string, signature: string) {
    console.log(paymentId,orderId,signature);
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser ? currentUser.userId : undefined
    const paymentResponse = {
      RazorpayPaymentId: paymentId,
      UserId: userId
    };
    this.checkoutService.makePayment(paymentResponse)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (data: any) => {
        this.checkoutForm.reset();
        this.cartStateService.clearCart();
        this.router.navigate([environment.routes.orderSummary]);
      },
      (error: any) => {
        this.logService.logErrorWithDetails(environment.messages.paymentError,error);
      }
    );
  }

  calculateTotalAmount(): number {
    return 0;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
