import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [SidebarComponent, CommonModule, RouterLink],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent implements OnInit{
  blogPosts$? : Observable<BlogPost[]>
  category$? : Observable<Category>

  totalCount?: number;
  pageNumber: number = 1;
  pageSize: number = 3;

  cateId: string | null = null;
  list: number[] = [];

  constructor(private blogPostService: BlogPostService, 
    private route: ActivatedRoute,
    private categoryService: CategoryService){
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next: (params) => {
        this.cateId = params.get('categoryId');
        if(this.cateId){
          this.category$ = this.categoryService.getCategoryById(this.cateId);
          this.blogPostService.getCountCategoryPosts(this.cateId).subscribe({
            next: (res) => {
              this.totalCount = res;
              this.list = new Array(Math.ceil(res / this.pageSize));
              if(this.cateId){
                this.blogPosts$ = this.blogPostService.getPostsByCategory(this.cateId, this.pageNumber, this.pageSize); 
              }
            }
          });
        }
      }
    })
    
  }
  getPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.blogPosts$ = this.blogPostService.getAllBlogPosts(pageNumber, this.pageSize);
  }
  getNextPage(){
    if(this.pageNumber + 1 > this.list.length){
      return;
    }
    this.pageNumber += 1;
    this.blogPosts$ = this.blogPostService.getAllBlogPosts(
      this.pageNumber, this.pageSize);
  }
  getPreviousPage(){
    if(this.pageNumber - 1 < 1){
      return;
    }
    this.pageNumber -= 1;
    this.blogPosts$ = this.blogPostService.getAllBlogPosts(
      this.pageNumber, this.pageSize);
  }
}
