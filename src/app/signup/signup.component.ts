import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserModel } from '../models/signup-model.model';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router'; 
import { environment } from '../../environments/environment';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  userModel: UserModel;
  errorMessage: string | null = null;
  successMessage: string | null = null; 
  signupSuccessMessage: string = environment.messages.signupSuccess;
  signupErrorMessage: string = environment.messages.signupError;
  unexpectedErrorMessage: string = environment.messages.unexpectedError;

  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) {
    this.userModel = new UserModel();
    this.signupForm = this.formBuilder.group(UserModel.getValidationRules(this.accountService));
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.accountService.signup(this.signupForm.value)
        .pipe(takeUntil(this.unsubscribe$)) // Apply takeUntil here
        .subscribe(
          () => {
            this.signupForm.reset();
            this.userModel = new UserModel();
            this.successMessage = this.signupSuccessMessage;
            setTimeout(() => {
              this.router.navigate([environment.routes.verifyOtp]);
            }, 2000);
          },
          (error) => {
            console.log(error);
            this.errorMessage = this.signupErrorMessage;
          }
        );
    } else {
      const formIsPristine = Object.keys(this.signupForm.controls).every(key => {
        const control = this.signupForm.get(key);
        return control?.pristine; 
      });
  
      if (formIsPristine) {
        this.signupForm.markAllAsTouched();
      } else {
        this.signupForm.markAllAsTouched();
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
