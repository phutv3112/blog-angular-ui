import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { ImageSelectorComponent } from "../../../shared/components/image-selector/image-selector.component";
import { ImageService } from '../../../shared/components/image-selector/image.service';
import { CookieService } from 'ngx-cookie-service';
import { TokenHelper } from '../../../shared/helpers/token-helper';

@Component({
  selector: 'app-edit-blog-post',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent, RouterLink,ImageSelectorComponent],
  templateUrl: './edit-blog-post.component.html',
  styleUrl: './edit-blog-post.component.css'
})
export class EditBlogPostComponent implements OnInit, OnDestroy {

  id: string | null = null;
  model?: BlogPost;

  paramSubscription?: Subscription;
  getSubscription?: Subscription;
  updateSubscription?: Subscription;
  imageSelectSubscription?: Subscription;

  categories$?: Observable<Category[]>;
  selectedCategories?: string[];

  isImageSelectorVisible: boolean = false;
  decodedUserId: string;

  constructor(private route : ActivatedRoute,
    private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private cookieService: CookieService
  ){
    const authToken = this.cookieService.get('Authorization');
    this.decodedUserId = TokenHelper.getUserId(authToken);
  }

  ngOnInit(): void {

    this.categories$ = this.categoryService.getAllCategories();

    this.paramSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if(this.id){
          this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (res) => {
              this.model = res;
              this.selectedCategories = res.categories.map(x => x.id);
            }
          })
        }
        this.imageSelectSubscription = this.imageService.onSelectImage().subscribe({
          next: (res) =>{
            if(this.model){
              this.model.featuredImageUrl = res.url;
              this.isImageSelectorVisible = false;
            }
          }
        })
      }
    })
  }
  onFormSubmit(){
    if(this.model && this.id){
      var updateModel = {
        title: this.model.title,
        shortDescription: this.model.shortDescription,
        content: this.model.content,
        featuredImageUrl: this.model.featuredImageUrl,
        publishedDate: new Date(),
        authorId: this.decodedUserId,
        isVisible: this.model.isVisible,
        categories: this.selectedCategories ?? []
      }
      this.updateSubscription = this.blogPostService.updateBlogPost(this.id, updateModel).subscribe({
        next: (res)=>{
          this.router.navigateByUrl("/admin/blogposts");
        }
      })
    }
  }

  onDelete(){
    if(this.id){
      this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (res) => {
          this.router.navigateByUrl('/admin/blogposts')
        }
      })
    }
  }

  openImageSelector(){
    this.isImageSelectorVisible = true;
  }
  closeImageSelector(){
    this.isImageSelectorVisible = false;
  }
  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
    this.getSubscription?.unsubscribe();
    this.updateSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
