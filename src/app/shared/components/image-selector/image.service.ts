import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  selectedImage : BehaviorSubject<BlogImage> = new BehaviorSubject<BlogImage>({
    id: '',
    fileExtension : '',
    fileName : '',
    title : '',
    url : ''
  });

  constructor(private http: HttpClient) { }

  uploadImage(file: File, fileName: string, title: string): Observable<BlogImage>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('fileName', fileName);

    return this.http.post<BlogImage>(`${environment.apiBaseUrl}/api/Images`, formData);
  }
  getAllImages(): Observable<BlogImage[]>{
    return this.http.get<BlogImage[]>(`${environment.apiBaseUrl}/api/Images`);
  }
  deleteImage(id: string): Observable<void>{
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/Images/${id}`);
  }
  selectImage(image: BlogImage):void{
    this.selectedImage.next(image);
  }
  onSelectImage(): Observable<BlogImage>{
    return this.selectedImage.asObservable();
  }
}