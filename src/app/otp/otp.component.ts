import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Subject, timer } from 'rxjs';
import { take, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { environment } from 'src/environments/environment';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  otp!: string;
  isResending: boolean = false;
  isVerifying: boolean = false;
  verificationError: string | null = null;
  remainingTime: number = 30;
  verificationSuccess: boolean = false;
  successMessage: string | null = null;
  private unsubscribe$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router,private logService:LogService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onOtpChanged() {
    this.verificationError = null;
    this.verificationSuccess = false;
    this.successMessage = null;
  }

  resendOtp() {
    this.isResending = true;
    this.verificationError = null;
    this.accountService.resendOtp().subscribe(
      () => {
        this.startResendCountdown();
      },
      (error) => {
        this.verificationError = error; 
        this.isResending = false;
      }
    );
  }

  startResendCountdown() {
    const timer$ = timer(0, 1000).pipe(
      take(this.remainingTime),
      map(() => --this.remainingTime)
    );

    timer$.subscribe(
      (remainingSeconds) => {
        this.remainingTime = remainingSeconds;
        if (remainingSeconds === 0) {
          this.isResending = false;
          this.remainingTime = 30;
        }
      }
    );
  }

  verifyOtp(): void {
    this.isVerifying = true;
    this.verificationError = null;
    this.accountService.verifyOtp(this.otp).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (response) => {
        this.isVerifying = false;
        this.verificationError = null;
        this.verificationSuccess = true;
        this.successMessage = environment.messages.otpVerificationSuccess;
        this.accountService.clearSuccessMessage();

        setTimeout(() => {
          this.router.navigate([environment.routes.login]);
        }, 2000);
      },
      (error) => {
        this.verificationError = environment.messages.otpVerificationFailure;
        this.isVerifying = false;
        this.verificationSuccess = false;
        this.successMessage = null;
        this.logService.logErrorWithDetails(environment.messages.verifyOtpError, error);
      }
    );
  }
}
