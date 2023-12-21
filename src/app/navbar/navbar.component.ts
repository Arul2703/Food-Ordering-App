import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { CartStateService } from '../services/cart-state.service';
import { Router } from '@angular/router';
import { UserModel } from '../models/signup-model.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  cartCount: number = 0;
  currentUser: UserModel | null = null; 

  constructor(
    private accountService: AccountService,
    private cartStateService: CartStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the currentUser$ observable to update the authentication status
    this.accountService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.isAdmin = user?.isAdmin ?? false;
      this.currentUser = user; 
    });

    // Check the initial authentication status
    this.isAuthenticated = !!this.accountService.getCurrentUser();
    this.isAdmin = this.accountService.getCurrentUser()?.isAdmin ?? false;

    // Subscribe to the cartCount$ observable in cartStateService to get the cart count
    this.cartStateService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }
  
  logout(): void {
    this.accountService.logout();
    this.currentUser = null;
    this.router.navigate([environment.routes.menu]); 
  }
}
// import { Component, OnInit } from '@angular/core';
// import { AccountService } from '../services/account.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent implements OnInit {
//   isAdmin: boolean | null = null;
//   private authSubscription: Subscription | undefined;

//   constructor(private accountService: AccountService) {}

//   ngOnInit(): void {
//     this.authSubscription = this.accountService.currentUser$.subscribe((user) => {
//       this.isAdmin = user?.isAdmin ?? false;
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.authSubscription) {
//       this.authSubscription.unsubscribe();
//     }
//   }

//   logout(): void {
//     this.accountService.logout();
//     this.isAdmin = false;
//     localStorage.removeItem('userRole'); 
//   }
// }
