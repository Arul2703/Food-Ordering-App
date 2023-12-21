import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AccountService } from "../services/account.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userRole = this.accountService.getUserRole();
    if (userRole === environment.userRoles.admin) {
      return true;
    } else {
      this.router.navigate([environment.routes.login]);
      return false;
    }
  }
}