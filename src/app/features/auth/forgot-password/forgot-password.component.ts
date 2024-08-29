import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForgotPasswordDto } from '../models/forgot-password.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent{
  model: ForgotPasswordDto;
  forgotMessage?:string;
  constructor(private authService: AuthService) {
    this.model = { email: '' };
  }
  onFormSubmit(){
    this.authService.forgotPassword(this.model).subscribe({
      next: (res) => {
        console.log("send email to reset password");
        console.log(res);
        this.forgotMessage = res.message;
      },
      error: (error) => {
        console.log("error", error);
      }
    })
  }
}
