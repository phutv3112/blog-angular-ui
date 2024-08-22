import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model:LoginRequest;
  constructor(private authService : AuthService, private cookieService: CookieService,
    private router: Router
  ) {
    this.model = { email: '', password: '' };
  }
  onFormSubmit(){
    this.authService.login(this.model).subscribe({
      next: (res)=>{
        this.cookieService.set("Authorization", `Bearer ${res.token}`,undefined, '/', undefined, true,'Strict')

        this.router.navigateByUrl('/');

        this.authService.setUser({
          email: res.email,
          roles: res.roles
        })
      }
    })
  }
  onGoogleLogin() {
    this.authService.handleAuthentication();
  }
}
