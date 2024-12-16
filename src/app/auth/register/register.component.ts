import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform: scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class RegisterComponent {
  email: string = '';
  name: string = '';
  password: string = '';
  confirmPassword: string = '';

  ngOnInit(): void {

    const token = this.service.getTokenFromCookie() || this.service.getTokenFromLocalStorage();
    if (token && !this.service.isTokenExpired()) {
      this.router.navigate(['/home']);
    }
  }

  constructor(public layoutService: LayoutService, private service: ServiceService, private router: Router) {}

  register() {
    if (this.password === this.confirmPassword) {
      this.service.register(this.email, this.password, this.name).subscribe(
        (response) => {
          console.log('Registro exitoso', response);
  
          // Suponiendo que la respuesta no incluye un token, se redirige al login
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          console.error('Error al registrar', error);
        }
      );
    } else {
      console.log('Las contraseñas no coinciden');
    }
  }
  

  
}
