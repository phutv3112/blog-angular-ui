import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  blogPosts$? : Observable<BlogPost[]>

  totalCount?: number;
  pageNumber: number = 1;
  pageSize: number = 3;

  list: number[] = [];

  constructor(private blogPostService: BlogPostService){}
  ngOnInit(): void {
    this.blogPostService.getPostCount().subscribe({
      next: (res) => {
        this.totalCount = res;
        this.list = new Array(Math.ceil(res / this.pageSize));
        this.blogPosts$ = this.blogPostService.getAllBlogPosts(this.pageNumber, this.pageSize); 
      }
    });
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
