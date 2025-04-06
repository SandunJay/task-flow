import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if we're in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Check if the user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn) {
        return true;
      }
      
      // If not logged in, redirect to the login page
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
    
    // During server-side rendering, allow navigation to continue
    // This can be refined based on your app's needs
    return true;
  }
}
