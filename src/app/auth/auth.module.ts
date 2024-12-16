import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServiceService } from './service.service';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        AuthRoutingModule
    ], 
    providers: [ServiceService,  {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,  
        multi: true  
      }],
})
export class AuthModule { }
