import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ServiceService } from '../../../../auth/service.service';

@Component({
  selector: 'app-mypage',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.css']
})
export class MypageComponent {

  constructor(private service: ServiceService, private router: Router) {}

  // Función para cerrar sesión
  logout(): void {
    // Eliminar el token de las cookies y localStorage
    this.service.removeToken();
    localStorage.removeItem('access_token');

    // Redirigir al usuario a la página de login
    this.router.navigate(['/auth/login']);
  }
}
