import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { environment } from '../../../../environments/environment';
import { UpdateBlogPost } from '../models/update-blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  constructor(private http: HttpClient) { }

  addBlogPost(model: AddBlogPost): Observable<BlogPost>{
    return this.http.post<BlogPost>(`${environment.apiBaseUrl}/api/BlogPosts?addAuth=true`, model);
  }
  getAllBlogPosts(pageNumber?: number, pageSize?: number): Observable<BlogPost[]>{
    let params = new HttpParams();
    if(pageNumber){
      params = params.set('pageNumber', pageNumber);
    }
    if(pageSize){
      params = params.set('pageSize', pageSize);
    }
    return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/BlogPosts`, {
      params: params
    });
  }
  getPostCount():Observable<number>{
    return this.http.get<number>(`${environment.apiBaseUrl}/api/BlogPosts/count`);
  }
  getBlogPostById(id: string): Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/BlogPosts/${id}?addAuth=true`);
  }
  getBlogPostByUrl(url:string): Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/BlogPosts/${url}?addAuth=true`);
  }
  updateBlogPost(id: string, post: UpdateBlogPost): Observable<void>{
    return this.http.put<void>(`${environment.apiBaseUrl}/api/BlogPosts/${id}?addAuth=true`, post);
  }
  deleteBlogPost(id: string): Observable<void>{
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/BlogPosts/${id}?addAuth=true`);
  }
}
