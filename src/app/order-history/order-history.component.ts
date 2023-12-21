import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { InvoiceDetails } from '../models/invoice-details';
import { OrderDetails } from '../models/order-details';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: InvoiceDetails[] = [];
  
  userId = 1; 
  selectedInvoice: InvoiceDetails | undefined;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private authService : AuthService,
    private logService : LogService ) 
    {}

  ngOnInit(): void {
    this.getOrderHistory();
  }

  getOrderHistory(): void {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser?.userId;
    this.orderService.getOrderHistory(userId!).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data) => {
        this.orderHistory = data;
        console.log(data);
      },
      (error) => {
        this.logService.logErrorWithDetails(environment.messages.orderHistoryFailure, error);
      }
    );
  }

  showOrderDetails(invoice: InvoiceDetails): void {
    this.selectedInvoice = invoice;
  }

  calculateTotalAmount(orderDetails: OrderDetails[]): number {
    if (orderDetails.length > 0) {
      return orderDetails[0].totalAmount;
    }
    return 0;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
