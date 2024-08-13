import { FileUploadService } from './../file-upload.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  // selectedFile: File | null = null;
  selectedFile: any[] = [];
  isHovering: boolean = false;
  isUploading: boolean = false;
  uploadStatus: string = '';
  filesList: any[] = [];

  constructor(private _fileUploadService: FileUploadService) {}

  ngOnInit(): void {
    this.getUplodedFiles();
  }

  getUplodedFiles(): void {
    this._fileUploadService.getFiles().subscribe((files: any[]) => {
      console.log(files);
      this.filesList = files;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files;
    // this.isValidFileType(this.selectedFile)
    if (this.selectedFile) {
      this.uploadStatus = '';
      this.onUpload();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
    if (event.dataTransfer?.files.length) {
      this.selectedFile = Array.from(event.dataTransfer.files);
      if (this.selectedFile ) {
        // && this.isValidFileType(this.selectedFile)
        this.uploadStatus = '';
        this.onUpload();
      }
    }
  }

  convertFileSize(size: number): string {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size >= 1024 && size < 1048576) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / 1048576).toFixed(2) + ' MB';
    }
  }

  imgSrc(type: string): string {
    if (type.includes('pdf')) {
      return 'pdf.svg';
    }
    return 'png.svg'
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'video/mp4',
      'audio/mp3',
      'application/pdf',
    ];
    return allowedTypes.includes(file.type);
  }

  onUpload() {
    if (this.selectedFile.length > 0) {
      this.isUploading = true;
      let completedUploads = 0;

      this.selectedFile.forEach((file) => {
        if (this.isValidFileType(file)) {
          this._fileUploadService.uploadFiles(file).subscribe({
            next: () => {
              console.log(`${file.name} uploaded successfully`);
              completedUploads++;
              if (completedUploads === this.selectedFile.length) {
                this.getUplodedFiles();
                this.isUploading = false;
                this.uploadStatus = 'All uploads completed';
                setTimeout(() => {
                  this.uploadStatus = '';
                }, 4000);
              }
            },
            error: (err) => {
              console.error(`Error uploading ${file.name}`, err);
              this.isUploading = false;
              this.uploadStatus = 'Upload failed';
              setTimeout(() => {
                this.uploadStatus = '';
              }, 4000);
            },
          });
        } else {
          this.isUploading = false;
          this.uploadStatus = `File type not allowed: ${file.name}`;
        }
      });
    }
  }

  // onUpload() {
  //   this.isUploading = true;
  //   if (this.selectedFile) {
  //     this._fileUploadService.uploadFile(this.selectedFile).subscribe({
  //       next: () => {
  //         console.log('uploaded successfully');
  //         this.getUplodedFiles();
  //         this.isUploading = false;
  //         this.uploadStatus = '1 Upload Completed';
  //         setTimeout(() => {
  //           this.uploadStatus = '';
  //         }, 4000);
  //       },
  //       error: (err) => {
  //         console.error('Error uploading ', err);
  //         this.isUploading = false;
  //         this.uploadStatus = 'Upload failed';
  //         setTimeout(() => {
  //           this.uploadStatus = '';
  //         }, 4000);
  //       },
  //     });
  //   }
  // }
}
