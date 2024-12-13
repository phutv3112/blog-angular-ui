import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentDto } from '../models/comment-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {}
  getCommentsByPostId(postId: string,query?: string, pageNumber?: number, pageSize?: number): Observable<CommentDto[]>{
    let params = new HttpParams();
    if(query){
      params = params.set('query', query);
    }
    if(pageNumber){
      params = params.set('pageNumber', pageNumber);
    }
    if(pageSize){
      params = params.set('pageSize', pageSize);
    }
    return this.http.get<CommentDto[]>(`${environment.apiBaseUrl}/api/Comment/admin/post/${postId}`, {
      params: params
    })
  }
  getCountCommentsByPostId(postId: string): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/api/Comment/count/${postId}`);
  }
  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/Comment/${commentId}`);
  }
}
