import { Component, Input } from '@angular/core';
import { CommentDto } from '../models/comment-dto';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { CommonModule } from '@angular/common';
import { BlogPostService } from '../services/blog-post.service';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.css'
})
export class PostCommentComponent {
  postId: string | null = null;
  postTitle: string = 'Tiêu đề bài viết'; // Giả định hoặc load từ API nếu cần
  comments: CommentDto[] = [];
  totalCount?: number;
  pageNumber: number = 1;
  pageSize: number = 5;

  list: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private postService: BlogPostService
  ) {}

  ngOnInit(): void {
    // Lấy `postId` từ URL
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    this.commentService.getCountCommentsByPostId(this.postId).subscribe({
      next: (res) => {
        this.totalCount = res;
        this.list = new Array(Math.ceil(res / this.pageSize));
      }
    })
    this.postService.getBlogPostById(this.postId).subscribe({
      next: (res) => {
        this.postTitle = res.title;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    })
    this.loadComments();
  }
  onSearch(query? : string){
    if (this.postId) {
      this.commentService.getCommentsByPostId(this.postId, query, this.pageNumber, this.pageSize).subscribe({
        next: (comments) => {
          this.comments = comments.map((comment) => {
            return {
              ...comment,
              updatedDate: new Date(comment.updatedDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            };
          });
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }
  }
  getPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.loadComments();
  }
  getNextPage(){
    if(this.pageNumber + 1 > this.list.length){
      return;
    }
    this.pageNumber += 1;
    this.loadComments();
  }
  getPreviousPage(){
    if(this.pageNumber - 1 < 1){
      return;
    }
    this.pageNumber -= 1;
    this.loadComments();
  }

  loadComments(): void {
    if (this.postId) {
      this.commentService.getCommentsByPostId(this.postId,undefined, this.pageNumber, this.pageSize).subscribe({
        next: (comments) => {
          this.comments = comments.map((comment) => {
            return {
              ...comment,
              updatedDate: new Date(comment.updatedDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            };
          });
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }
  }
  

  deleteComment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe(() => {
        this.comments = this.comments.filter((comment) => comment.id !== commentId);
        this.comments = this.comments.map((comment) => {
          return {
            ...comment,
            updatedDate: new Date(comment.updatedDate).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        });
        alert('Delete comment successfully!');
      });
    }
  }
}
