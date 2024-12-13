import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user-dto';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userId: string | null = null;
  user?: UserDto;
  isEditable: boolean = false;
  updateMessage: string = '';
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.userId = params.get('id');
        if(this.userId){
          this.userService.getUserById(this.userId).subscribe({
            next: (res) => {
              this.user = res;
            },
            error: (err) => {
              console.log('Error:', err);
            }
          })
                   
        }
      }
    })
  }
  toggleEdit() {
    this.isEditable = !this.isEditable;
  }

  saveProfile() {
    if(this.userId && this.user){
      this.userService.updateUserProfile(this.userId, this.user).subscribe({
        next: (res) => {
          console.log('Update success:', res);
          if(res){
            this.updateMessage = 'Profile updated successfully!';
            this.isEditable = false;
          }
        },
        error: (err) => {
          console.log('Update error:', err);
          if(err){
            this.updateMessage = 'Profile update failed!';
          }
        }
      })
    }
  }

}
