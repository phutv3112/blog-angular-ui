import { Component, OnInit } from '@angular/core';
import { CategoryCountPosts } from '../../category/models/categoryCountPosts';
import { Observable } from 'rxjs';
import { CategoryService } from '../../category/services/category.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  categoryCountPosts$? : Observable<CategoryCountPosts[]>

  searchTerm: string = '';
  suggestions: any[] = []; 
  listCategories: any[] = [];

  constructor(private categoryService: CategoryService,
    private router: Router,  
  ){
  }
  ngOnInit(): void {
    this.categoryCountPosts$ = this.categoryService.getCategoriesAndCountPosts();
    this.categoryService.getAllCategories(undefined, undefined, undefined, undefined, 90).subscribe({
      next: (res) => {
        this.listCategories = res;
      }
    })
  }
  searchCategory(){
    alert("click search category...");
  }

  onSearchCategory(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.toLowerCase();
    this.searchTerm = value;
    console.log('Giá trị hiện tại:', value);
    // Xử lý logic với giá trị "value"
    if (value) {
      // Lọc các giá trị trùng khớp với giá trị nhập vào
      this.suggestions = this.listCategories.filter(category => 
        category.name.toLowerCase().includes(value));
    } else {
      // Nếu không có giá trị nhập, làm trống danh sách gợi ý
      this.suggestions = [];
    }
  }
  
  onSelectSuggestion(suggestion: any) {
    console.log('Gợi ý được chọn:', suggestion);
    // Thực hiện điều hướng hoặc xử lý khác tại đây
  }
  

  // Dữ liệu giả lập (thay bằng API thực tế)
  getMockCategories() {
    return [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Health' },
      { id: 3, name: 'Education' },
      { id: 4, name: 'Sports' }
    ];
  }
}
