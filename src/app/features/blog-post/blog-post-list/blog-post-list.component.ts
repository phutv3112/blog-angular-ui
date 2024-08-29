import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-post-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './blog-post-list.component.html',
  styleUrl: './blog-post-list.component.css'
})
export class BlogPostListComponent implements OnInit{
  blogPosts$?: Observable<BlogPost[]>;

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
