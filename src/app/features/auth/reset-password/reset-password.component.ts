import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResetPasswordDto } from '../models/reset-password.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  model: ResetPasswordDto;
  email: string = '';
  code: string = '';
  passwordMatched?: string;
  resetMessage?: string;

  constructor(private route : ActivatedRoute, 
    private authService: AuthService,
    private router: Router, 
  ) {
    this.model = { password: '', passwordConfirm: '' };
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.code = params['code'];
    });
  }
  onFormSubmit() {
    this.authService.resetPassword(this.model, this.email, this.code).subscribe({
      next: () => {
        this.resetMessage = `Password reset successfully. <a href="/account/login">Click here to login</a>`;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  checkPasswordMatch(){
    if(this.model.password === this.model.passwordConfirm){
      this.passwordMatched = "";
    }else{
      this.passwordMatched = "Passwords do not match";
    }
  }
}
