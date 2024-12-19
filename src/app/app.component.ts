import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { CategoryListComponent } from "./features/category/category-list/category-list.component";
import { MarkdownComponent } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./features/public/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CategoryListComponent, MarkdownComponent, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'blog-angular';
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }
  isRegisterPage(): boolean {
    return this.router.url.includes('/register');
  }
  isAccountPage(): boolean {
    return this.router.url.includes('/account');
  }
  isAdminPage(): boolean {
    return this.router.url.includes('/admin');
  }
  isAdminManagerPage(): boolean {
    return this.router.url.includes('/admin/manage');
  }
}
