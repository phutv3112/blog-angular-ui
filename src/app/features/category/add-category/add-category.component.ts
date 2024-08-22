import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnDestroy {

  private addCategorySubscription?: Subscription;
  model: AddCategoryRequest
  constructor(private categoryService: CategoryService, 
    private router: Router) {
    this.model = { name: '', urlHandle: '' };
  }
  
  onSubmit(){
    //debugger;
    console.log(this.model);
    this.categoryService.addCategory(this.model)
    .subscribe({
      next: (res) => {
        this.router.navigateByUrl("/admin/categories")
      },
      error: (error) => console.error('Error adding category:', error)
    })
  }
  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }
}
