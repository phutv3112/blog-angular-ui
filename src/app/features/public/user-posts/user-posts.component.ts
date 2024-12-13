import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [SidebarComponent, CommonModule, RouterLink],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css'
})
export class UserPostsComponent {
  blogPosts$? : Observable<BlogPost[]>

  totalCount?: number;
  pageNumber: number = 1;
  pageSize: number = 3;

  authorId: string | null = null;
  list: number[] = [];
  url: string | null = null;
  constructor(private route: ActivatedRoute,
    private blogPostService: BlogPostService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next: (params) => {
        this.authorId = params.get('authorId');
        if(this.authorId){
          this.blogPostService.getCountUserPosts(this.authorId).subscribe({
            next: (res) => {
              this.totalCount = res;
              this.list = new Array(Math.ceil(res / this.pageSize));
              if(this.authorId){
                this.blogPosts$ = this.blogPostService.getPostsByAuthor(this.authorId, this.pageNumber, this.pageSize); 
              }
            }
          });
        }
      }
    })
  }
  getPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.blogPosts$ = this.blogPostService.getAllBlogPosts(undefined, pageNumber, this.pageSize);
  }
  getNextPage(){
    if(this.pageNumber + 1 > this.list.length){
      return;
    }
    this.pageNumber += 1;
    this.blogPosts$ = this.blogPostService.getAllBlogPosts(undefined, 
      this.pageNumber, this.pageSize);
  }
  getPreviousPage(){
    if(this.pageNumber - 1 < 1){
      return;
    }
    this.pageNumber -= 1;
    this.blogPosts$ = this.blogPostService.getAllBlogPosts(undefined,
      this.pageNumber, this.pageSize);
  }
}
