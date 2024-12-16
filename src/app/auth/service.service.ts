import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: { access_token: string }; 
  user: {
    email: string;
    password: string;
    rememberMe: boolean;
  }; 
}

export interface RegisterResponse {
  token: { access_token: string }; 
  user: {
    email: string;
    password: string;
    name: string;
  }; 
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password, rememberMe }).pipe(
      tap(response => {
        const token = response.token.access_token;
        if (rememberMe) {
          this.storeTokenInCookie(token);  // Almacena el token en las cookies
        } else {
          this.storeTokenInLocalStorage(token);  // Almacena el token en localStorage con expiración
        }
      })
    );
  }

  storeTokenInCookie(token: string): void {
    const expiresIn = 7;  // Guardar el token por 7 días si "Remember me" está activo
    this.cookieService.set('authToken', token, expiresIn, '/');
  }

  storeTokenInLocalStorage(token: string): void {
    const expiresIn = 60 * 60 * 1000;  // 1 hora en milisegundos
    const expiryTime = Date.now() + expiresIn;
    localStorage.setItem('access_token', token);
    localStorage.setItem('expiry_time', expiryTime.toString());  // Guardamos la hora de expiración
  }

  getTokenFromCookie(): string | null {
    return this.cookieService.get('authToken') || null;
  }

  getTokenFromLocalStorage(): string | null {
    const expiryTime = localStorage.getItem('expiry_time');
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
      // El token ha caducado, eliminamos todo
      this.removeToken();
      return null;
    }
    return localStorage.getItem('access_token') || null;
  }

  removeToken(): void {
    this.cookieService.delete('authToken', '/');
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiry_time');
  }

  isTokenExpired(): boolean {
    // Verificamos si el token en cookies ha expirado
    const token = this.getTokenFromCookie() || this.getTokenFromLocalStorage();
    if (!token) return true;  // Si no hay token, se considera que está expirado.

    try {
      const decoded = this.decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000); 
      return decoded.exp < currentTime; 
    } catch (error) {
      console.log('Error al decodificar el token:', error);
      return true;
    }
  }

  private decodeJwt(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token JWT inválido');
    const decoded = atob(parts[1]);
    return JSON.parse(decoded); 
  }

  checkToken(): void {
    const token = this.getTokenFromCookie() || this.getTokenFromLocalStorage();
    
    console.log('Token en checkToken():', token);  // Verifica si el token está presente
    
    if (token && !this.isTokenExpired()) {
      console.log('Token válido, redirigiendo a /home');
      this.router.navigate(['/home']);
    } else {
      console.log('Token no válido o expirado, redirigiendo a /auth/login');
      this.router.navigate(['/auth/login']);
    }
  }

  register(email: string, password: string, name: string): Observable<RegisterResponse> {
    const registerData = {
      email,
      password,
      name,
    };

    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, registerData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { email });
  }
}
