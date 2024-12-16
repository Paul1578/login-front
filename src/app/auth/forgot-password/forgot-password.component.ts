import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { LayoutService } from '../../layout/service/app.layout.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(
    public layoutService: LayoutService, 
    private service: ServiceService, 
    private router: Router
  ) {}

  // Método para enviar el enlace de restablecimiento
  sendResetLink() {
    if (this.email) {
      this.service.forgotPassword(this.email).subscribe(
        (response) => {
          console.log('Link de recuperación enviado');
          this.router.navigate(['/auth/login']); 
        },
        (error) => {
          console.error('Error al enviar el enlace de recuperación', error);
        }
      );
    } else {
      console.log('Por favor ingresa tu correo electrónico');
    }
  }
}
