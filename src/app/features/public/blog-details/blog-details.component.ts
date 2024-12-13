import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CookieService } from 'ngx-cookie-service';
import { TokenHelper } from '../../../shared/helpers/token-helper';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, MarkdownComponent, RouterLink, SidebarComponent],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit {

  url: string | null = null;
  like : number = 0;
  isLiked: boolean = false;
  decodedUserId: string | null = null;
  showCommentBox = false;

  blogPost$?: Observable<BlogPost>;

  constructor(private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private cookieService: CookieService) { 
      const authToken = this.cookieService.get('Authorization');
      this.decodedUserId = TokenHelper.getUserId(authToken);
    }
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.url = params.get('url');
        console.log('URL:', this.url);
        if(this.url){
          this.blogPost$ = this.blogPostService.getBlogPostByUrl(this.url);
          this.blogPostService.getLikePost(this.url).subscribe({
            next: (res) => {
              this.like = res;
            },
            error: (err) => {
              console.log('Error:', err);
            }
          });
          if(this.decodedUserId){
            this.blogPostService.checkLiked(this.decodedUserId,this.url).subscribe({
              next: (res) => {
                this.isLiked = res;
              },
              error: (err) => {
                console.log('Error:', err);
              }
            });
          }
          
        }
      }
    })
  }
  onLikeClick() :void{
    // const authToken = this.cookieService.get('Authorization');
    // const decodedUserId = TokenHelper.getUserId(authToken);
    console.log('Decoded UserId:', this.decodedUserId);
    if(this.url && this.decodedUserId){
      this.blogPostService.likePost(this.decodedUserId, this.url).subscribe({
        next: (res) => {
          console.log('Liked:', res);
          this.like = res;
          if(this.decodedUserId && this.url){
            this.blogPostService.checkLiked(this.decodedUserId,this.url).subscribe({
              next: (res) => {
                this.isLiked = res;
              },
              error: (err) => {
                console.log('Error:', err);
              }
            });
          }
        },
        error: (err) => {
          console.log('Error:', err);
        }
      });
    }
  }

  toggleCommentBox(): void {
    this.showCommentBox = !this.showCommentBox;
  }
}
