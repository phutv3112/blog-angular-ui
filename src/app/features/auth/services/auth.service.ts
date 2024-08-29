import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { ForgotPasswordDto } from '../models/forgot-password.model';
import { ResetPasswordDto } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);
  constructor(private http:HttpClient,
    private cookieService: CookieService,
  ) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/login`,{
      email : loginRequest.email,
      password: loginRequest.password
    })
  }
  register(registerRequest: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/register`,{
      email : registerRequest.email,
      password: registerRequest.password
    })
  }
  setUser(user: User): void{
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));
  }
  user():Observable<User | undefined>{
    return this.$user.asObservable();
  }
  getUser():User | undefined{
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');
    if(email && roles){
      return { email, roles: roles.split(',')};
    }
    return undefined;
  }
  logout(){
    localStorage.clear();
    this.cookieService.delete('Authorization','/');
    this.$user.next(undefined);
  }
  loginWithGoogle(idToken: string):Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/google-login`, { idToken });
  }
  loginWithFacebook(authToken: string):Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/facebook-login`, { authToken });
  }

  forgotPassword(forgotPassword: ForgotPasswordDto): Observable<{message: string}>{
    return this.http.post<{message: string}>(`${environment.apiBaseUrl}/api/Auth/forgot-password`, forgotPassword);
  }
  resetPassword(resetPassword: ResetPasswordDto, email: string, code: string): Observable<{message: string}>{
    return this.http.post<{message: string}>(`${environment.apiBaseUrl}/api/Auth/reset-password?email=${email}&code=${code}`, resetPassword);
  }
}
