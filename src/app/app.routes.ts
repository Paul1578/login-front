import { provideRouter, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { MypageComponent } from './core/components/pages/mypage/mypage.component';
import { AuthGuard } from './auth/auth.guard';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { 
    path: 'home', 
    component: AppLayoutComponent, 
    canActivate: [AuthGuard],  
    children: [
      { path: '', component: MypageComponent }
    ]
  },
 
];


export const appProviders = [
  provideRouter(routes),
  provideHttpClient(),
  importProvidersFrom(CookieService),
];
