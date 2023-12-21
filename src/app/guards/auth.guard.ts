import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check if the user is logged in by retrieving the token from the AuthService
    const token = this.authService.getToken();
    if (token) {
      return true;
    }

    // User is not logged in, redirect to login page
    this.router.navigate([environment.routes.login]);
    return false;
  }
}
