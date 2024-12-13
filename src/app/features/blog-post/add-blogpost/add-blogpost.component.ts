import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { ImageSelectorComponent } from '../../../shared/components/image-selector/image-selector.component';
import { ImageService } from '../../../shared/components/image-selector/image.service';
import { CookieService } from 'ngx-cookie-service';
import { TokenHelper } from '../../../shared/helpers/token-helper';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  imports: [FormsModule, CommonModule, MarkdownComponent, ImageSelectorComponent],
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css'
})
export class AddBlogpostComponent implements OnDestroy, OnInit{

  model: AddBlogPost;
  categories$? : Observable<Category[]>;

  addBlogPostSubscription?: Subscription;
  imageSelectSubscription?: Subscription;

  isImageSelectorVisible: boolean = false;

  constructor(private blogPostService: BlogPostService, 
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService, 
    private cookieService: CookieService){
      const authToken = this.cookieService.get('Authorization');
      var decodedUserId = TokenHelper.getUserId(authToken);
    this.model = {
      title: '',
      shortDescription: '',
      content: '',
      featuredImageUrl: '',
      publishedDate: new Date(),
      authorId: decodedUserId,
      isVisible: true,
      categories: []
    };
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectSubscription = this.imageService.onSelectImage().subscribe({
      next: (res) =>{
        this.model.featuredImageUrl = res.url;
        this.closeImageSelector();
      }
    })
  }
 
  onSubmit(){
    console.log(this.model);
    this.blogPostService.addBlogPost(this.model)
    .subscribe({
      next: (res)=>{
        console.log('Blog post added successfully:', res);
        this.router.navigateByUrl("/admin/blogposts");
      },
      error: (error) => console.error('Error adding blog post:', error)
    })
  }
  openImageSelector(){
    this.isImageSelectorVisible = true;
  }
  closeImageSelector(){
    this.isImageSelectorVisible = false;
  }
  ngOnDestroy(): void {
    this.addBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
