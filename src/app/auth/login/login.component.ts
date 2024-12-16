import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform: scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class LoginComponent implements OnInit{

  email: string = ''; 
  password: string = '';  
  rememberMe: boolean = false;

  constructor(public layoutService: LayoutService, private service: ServiceService, private router: Router ) { }

  ngOnInit(): void {
    // Verificamos si el usuario ya tiene un token válido, redirigiendo a /home si está autenticado
    const token = this.service.getTokenFromCookie() || this.service.getTokenFromLocalStorage();
    if (token && !this.service.isTokenExpired()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (!this.email || !this.password) {
      console.log('Please fill in both email and password');
      return;
    }
  
    this.service.login(this.email, this.password, this.rememberMe).subscribe(
      (response) => {
        console.log('Login success', response);
        const token = response.token.access_token;
  
        if (this.rememberMe) {
          this.service.storeTokenInCookie(token);  // Solo guardar en cookies si rememberMe es verdadero
          console.log('Token almacenado en cookies', token);
        } else {
          localStorage.setItem('access_token', token);  // Si no se quiere recordar, almacenarlo en localStorage
        }
  
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }  
}
