import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ImageService } from './image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css'
})
export class ImageSelectorComponent implements OnInit{
  private file? :File;
  title: string = "";

  images$?: Observable<BlogImage[]>

  @ViewChild('form', {static: false}) imageUploadForm?:NgForm;

  constructor(private imageService: ImageService) { }
  ngOnInit(): void {
    this.getImages();
  }
  onFileUploadChange(event: Event) :void{
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }
  uploadImage(){
      if(this.file && this.title !== ''){
        this.imageService.uploadImage(this.file, this.title).subscribe({
          next: (res) => {
            console.log(res);
            this.getImages();
            this.imageUploadForm?.resetForm();
          }
        })
      }
  }
  selectImage(image: BlogImage):void{
    this.imageService.selectImage(image);
  }
  private getImages(){
    this.images$ = this.imageService.getAllImages();
  }
  deleteImage(id: string):void{
    this.imageService.deleteImage(id).subscribe({
      next: () => {
        this.getImages();
      }
    })
  }
}
