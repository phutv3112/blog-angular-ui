declare var google: any;
import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterLink } from '@angular/router';

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  GoogleSigninButtonModule
} from '@abacritt/angularx-social-login';
import { SocialAuthService } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  model:LoginRequest;
  constructor(private authService : AuthService, 
    private cookieService: CookieService,
    private router: Router,
    private authLoginService: SocialAuthService
  ) {
    this.model = { email: '', password: '' };
  }
  user: any;
  errorMessage?: string;
  loggedIn?: boolean;
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '1081450409808-ubkdjab45ep2n8go0ohp7jp7pdr0co5a.apps.googleusercontent.com',
      callback: (res : any)=>{
        console.log(res);
        this.handleLogin(res);
      }
    });
    google.accounts.id.renderButton(document.getElementById('google-btn'),{
      theme: 'outline',
      size: 'medium',
      shape: 'square',
      type:'icon',
    })
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
      },
      error: (error) => {
        if(error.status == 400){
          this.errorMessage = "Invalid email or password!";
        }
      }
    })
  }
  private decodeToken(token:string){
    return JSON.parse(atob(token.split('.')[1]));
  }
  handleLogin(res:any){
    if(res){
      const payLoad = this.decodeToken(res.credential);

      sessionStorage.setItem('loggedInUser', JSON.stringify(payLoad));

      this.authService.loginWithGoogle(res.credential).subscribe({
        next: (resp) => {
          this.cookieService.set("Authorization", `Bearer ${resp.token}`,undefined, '/', undefined, true,'Strict')

          this.router.navigateByUrl('/');

          this.authService.setUser({
            email: resp.email,
            roles: resp.roles
          })
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
  signInWithFB(): void {
    this.authLoginService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authLoginService.authState.subscribe((user) =>{
      console.log(user.authToken);
      this.user = user;
      this.loginWithFacebook();
    })
    
  }

  loginWithFacebook(): void {
    console.log('User logged in Fb change auth', this.user);
    this.authService.loginWithFacebook(this.user.authToken).subscribe({
      next: (resp) => {
        this.cookieService.set("Authorization", `Bearer ${resp.token}`,undefined, '/', undefined, true,'Strict')

        this.router.navigateByUrl('/');

        this.authService.setUser({
          email: resp.email,
          roles: resp.roles
        })
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  signOut(): void {
    this.authLoginService.signOut();
  }

}
