import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { isFormControl } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit{
  categories$?: Observable<Category[]>;

  totalCount?: number;
  pageNumber: number = 1;
  pageSize: number = 5;

  list: number[] = [];

  constructor(private categoryService: CategoryService){
  }
  ngOnInit(): void {
    this.categoryService.getCategoryCount().subscribe({
      next: (res) => {
        this.totalCount = res;
        this.list = new Array(Math.ceil(res / this.pageSize));
        this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, this.pageNumber, this.pageSize);

      }
    })
  }
  onSearch(query? : string){
    this.categories$ = this.categoryService.getAllCategories(query);
  }
  sort(sortBy?: string, sortDirection?: string){
    this.categories$ = this.categoryService.getAllCategories(undefined, sortBy, sortDirection);
  }
  getPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, pageNumber, this.pageSize);
  }
  getNextPage(){
    if(this.pageNumber + 1 > this.list.length){
      return;
    }
    this.pageNumber += 1;
    this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, this.pageNumber, this.pageSize);
  }
  getPreviousPage(){
    if(this.pageNumber - 1 < 1){
      return;
    }
    this.pageNumber -= 1;
    this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, this.pageNumber, this.pageSize);
  }
}
