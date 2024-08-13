import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private files: File[] = [];

  constructor() { }

  uploadFiles(file: File): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        this.files.push(file);
        observer.next();
        observer.complete();
      }, 5000);
    });
  }

  // uploadFiles(files: File[]): Observable<void> {
  //   return new Observable(observer => {
  //     let completedUploads = 0;

  //     files.forEach((file, index) => {
  //       setTimeout(() => {
  //         this.files.push(file);
  //         completedUploads++;

  //         if (completedUploads === files.length) {
  //           observer.next();
  //           observer.complete();
  //         }
  //       }, 5000 * index); 
  //     });
  //   });
  // }

  getFiles(): Observable<File[]> {
    return of(this.files);
  }

}
