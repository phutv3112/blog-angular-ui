import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/register-request,model';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  model:RegisterRequest;
  constructor(private authService : AuthService, 
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.model = { email: '', password: '', passwordConfirm: '' };
  }
  errorMessage?: string;
  passwordMatched?: string;
  ngOnInit(): void {
  }
  onFormSubmit(){
    this.authService.register({email: this.model.email, password: this.model.password}).subscribe({
      next: (res) => {
        this.cookieService.set("Authorization", `Bearer ${res.token}`,undefined, '/', undefined, true,'Strict')

        this.router.navigateByUrl('/');

        this.authService.setUser({
          email: res.email,
          roles: res.roles
        })
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error.errors ? err.error.errors.join(', ') : 'An error occurred';
      }
    })
  }
  checkPasswordMatch(){
    if(this.model.password === this.model.passwordConfirm){
      this.passwordMatched = "";
    }else{
      this.passwordMatched = "Passwords do not match";
    }
  }
}
