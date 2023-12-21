import { Component, Input, OnInit } from '@angular/core';
import { OrderSummaryService } from '../services/order-summary.service';
import { OrderDetails } from '../models/order-details';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  orderSummary: OrderDetails[] | null = [];

  message!: string;
  private unsubscribe$ = new Subject<void>();

  constructor(private orderSummaryService: OrderSummaryService,private logService:LogService) {}

  ngOnInit() {
    this.orderSummaryService.orderSummary$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (orderSummary: any) => {
          this.orderSummary = orderSummary;
          console.log(this.orderSummary);
        },
        (error) => {
          this.logService.logErrorWithDetails(environment.messages.orderSummaryError, error);
        }
      );

    this.orderSummaryService.message$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (message: string) => {
          this.message = message;
        },
        (error) => {
          // console.error(environment.messages.orderSummaryMessageError, error);
          this.logService.logErrorWithDetails(environment.messages.orderSummaryMessageError, error);
        }
      );
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
