import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from './login.component';
import { AccountService } from '../services/account.service';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/signup-model.model';
import { HttpClientModule } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let accountService: jasmine.SpyObj<AccountService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    
    const accountServiceSpy = jasmine.createSpyObj('AccountService', ['login']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule,HttpClientModule],
      providers: [
        FormBuilder,
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.controls['email'];
    const passwordControl = component.loginForm.controls['password'];
    expect(emailControl.valid).toBeFalsy();
    expect(passwordControl.valid).toBeFalsy();
  });

  it('should mark form controls as touched on form submission', () => {
    fixture.detectChanges();
    component.onSubmit();
    expect(component.loginForm.controls['email'].touched).toBeTruthy();
    expect(component.loginForm.controls['password'].touched).toBeTruthy();
  });

  it('should call login method and navigate on successful login', fakeAsync(() => {
    const responseData: UserModel = {
      userId: 1,
      name: 'Arularasi J',
      email: 'arularasi2002@gmail.com',
      password: 'Arul@2002',
      confirmPassword: 'Arul@2002',
      isAdmin: false,
      RememberMe: false,
      token: '',
      user: undefined
    };
    accountService.login.and.returnValue(of(responseData));

    fixture.detectChanges();
    component.onSubmit();

    expect(accountService.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(component.showSuccessfulLoginMessage).toBeTruthy();
    expect(component.showInvalidCredentialsMessage).toBeFalsy();
    tick(1000);
    expect(router.navigate).toHaveBeenCalledWith([environment.routes.menu]);
  }));

  it('should show error message on login failure', fakeAsync(() => {
    const errorResponse = { status: environment.httpStatusCodes.unauthorized };
    accountService.login.and.returnValue(throwError(errorResponse));

    fixture.detectChanges();
    component.onSubmit();

    expect(accountService.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(component.showInvalidCredentialsMessage).toBeTruthy();
    expect(component.showSuccessfulLoginMessage).toBeFalsy();
    tick(1000);
    expect(toastrService.error).toHaveBeenCalled();
  }));

  it('should toggle password visibility', () => {
    component.passwordVisible = false;
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTruthy();
  });

  it('should reset flags after timeout', fakeAsync(() => {
    component.showInvalidCredentialsMessage = true;
    component.showSuccessfulLoginMessage = true;

    fixture.detectChanges();
    component.onSubmit();

    tick(1000);

    expect(component.showInvalidCredentialsMessage).toBeFalsy();
    expect(component.showSuccessfulLoginMessage).toBeFalsy();
  }));

  // Add more tests for specific elements and styling
  // Use fixture.debugElement.query to select elements and expect(element).toBeTruthy() to verify their presence.

});
