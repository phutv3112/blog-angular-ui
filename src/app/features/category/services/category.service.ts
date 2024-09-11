import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { CategoryCountPosts } from '../models/categoryCountPosts';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  addCategory(model: AddCategoryRequest):Observable<void>{
    return this.http.post<void>(`${environment.apiBaseUrl}/api/categories?addAuth=true`, model);
  }
  getAllCategories(query? : string, sortBy?:string, sortDirection?:string, pageNumber?: number, pageSize?: number): Observable<Category[]>{
    let params = new HttpParams();
    if(query){
      params = params.set('query', query);
    }
    if(sortBy){
      params = params.set('sortBy', sortBy);
    }
    if(sortDirection){
      params = params.set('sortDirection', sortDirection);
    }
    if(pageNumber){
      params = params.set('pageNumber', pageNumber);
    }
    if(pageSize){
      params = params.set('pageSize', pageSize);
    }
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/Categories`, {
      params: params
    })
  }
  getCategoriesAndCountPosts(): Observable<CategoryCountPosts[]>{
    return this.http.get<CategoryCountPosts[]>(`${environment.apiBaseUrl}/api/Categories/categories-count-posts`);
  }
  getCategoryById(id: string):Observable<Category>{
    return this.http.get<Category>(`${environment.apiBaseUrl}/api/Categories/${id}`);
  }
  getCategoryCount():Observable<number>{
    return this.http.get<number>(`${environment.apiBaseUrl}/api/categories/count`);
  }
  updateCategory(id: string, model: UpdateCategoryRequest):Observable<Category>{
    return this.http.put<Category>(`${environment.apiBaseUrl}/api/categories/${id}?addAuth=true`, model);

  }
  deleteCategory(id: string):Observable<void>{
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/categories/${id}?addAuth=true`);
  }
}
