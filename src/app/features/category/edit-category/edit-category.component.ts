import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule, FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  
  id: string | null = null;
  paramSubscription?: Subscription;
  updateCategorySubscription?: Subscription
  category?: Category;
  constructor(private route: ActivatedRoute, 
    private categoryService: CategoryService, 
  private router: Router){

  }
  
  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if(this.id){
          this.categoryService.getCategoryById(this.id).subscribe({
            next: (res) => {
              this.category = res;
            }
          })
        }
      }
    });
    
  }
  onSubmit(): void {
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? ''
    }
    if(this.id){
      this.categoryService.updateCategory(this.id, updateCategoryRequest).subscribe({
        next: (res)=>{
          this.router.navigateByUrl('/admin/categories')
        }
      })
    }
    
  }
  onDelete(){
    if(this.id){
      this.categoryService.deleteCategory(this.id).subscribe({
        next: (res) => {
          this.router.navigateByUrl('/admin/categories')
        }
      })
    }
  }
  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
    this.updateCategorySubscription?.unsubscribe();
  }
  
}
