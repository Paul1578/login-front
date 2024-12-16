import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private service: ServiceService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log('Verificando token en AuthGuard');

    const token = this.service.getTokenFromCookie() || this.service.getTokenFromLocalStorage();
    const isTokenValid = token && !this.service.isTokenExpired();

    if (isTokenValid) {
      return true;
    }

    console.log('No autorizado, redirigiendo a /auth/login');
    this.router.navigate(['/auth/login']);
    return false;
  }
}  
