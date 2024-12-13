import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/models/user.model';
import { CommonModule } from '@angular/common';
import { CategoryCountPosts } from '../../../features/category/models/categoryCountPosts';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../features/category/services/category.service';
import { CookieService } from 'ngx-cookie-service';
import { TokenHelper } from '../../../shared/helpers/token-helper';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  categoryCountPosts$? : Observable<CategoryCountPosts[]>
  user?:User;
  userId: string | null = null;

  constructor(private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private cookieService: CookieService
  ){
      const authToken = this.cookieService.get('Authorization');
      this.userId = TokenHelper.getUserId(authToken);
  }
  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (res)=>{
        this.user = res;
      }
    })
    this.user = this.authService.getUser();
    this.categoryCountPosts$ = this.categoryService.getCategoriesAndCountPosts();
  }
  onLogout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }
  isAdminPage(): boolean {
    return this.router.url.includes('/admin');
  }
  getClass(){
    if(this.isAdminPage()){
      return 'header_area'
    }else{
      return ''
    }
  }
}
