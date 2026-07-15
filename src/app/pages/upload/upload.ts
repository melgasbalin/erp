import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadService } from '../../core/services/file-upload.service';
import { MockFileData } from '../../core/mock-data/mock-data';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/mock-data/mock-data';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './upload.html',
  styleUrls: ['./upload.css']
})
export class UploadComponent implements OnInit {
  files: File[] = [];
  uploadedFiles: any[] = [];
  isDragging = false;
  uploadProgress: { [key: string]: number } = {};
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

  user: User | null = null;
  isSidebarOpen: boolean = false;

  constructor(
    private fileUploadService: FileUploadService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isSidebarOpen = window.innerWidth >= 768;
    }
    this.auth.currentUser$.subscribe(u => {
      this.user = u;
    });
    this.loadMockFiles();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadMockFiles(): void {
    this.uploadedFiles = MockFileData.map(file => ({
      ...file,
      uploadDate: new Date().toISOString()
    }));
  }

  onFileSelected(event: any): void {
    const selectedFiles = Array.from<File>(event.target.files);
    this.handleFiles(selectedFiles);
  }

  onDrop(event: any): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from<File>(event.dataTransfer.files);
      this.handleFiles(droppedFiles);
    }
  }

  onDragOver(event: any): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: any): void {
    event.preventDefault();
    this.isDragging = false;
  }

  handleFiles(files: File[]): void {
    for (const file of files) {
      if (file.size > this.maxFileSize) {
        alert(`El archivo ${file.name} excede el tamaño máximo permitido de 5MB`);
        continue;
      }
      if (!this.allowedTypes.includes(file.type)) {
        alert(`El tipo de archivo ${file.name} no está permitido. Solo se permiten imágenes, PDF y archivos de texto.`);
        continue;
      }
      this.files.push(file);
      this.uploadProgress[file.name] = 0;
      this.simulateUploadProgress(file.name);
    }
  }

  simulateUploadProgress(fileName: string): void {
    const interval = setInterval(() => {
      if (this.uploadProgress[fileName] < 100) {
        this.uploadProgress[fileName] += 10;
      } else {
        clearInterval(interval);
        this.addUploadedFile(fileName);
      }
    }, 200);
  }

  addUploadedFile(fileName: string): void {
    const mockFile = {
      id: Math.floor(Math.random() * 10000),
      name: fileName,
      type: 'mock',
      size: this.files.find(f => f.name === fileName)?.size || 0,
      uploadDate: new Date().toISOString(),
      url: `https://example.com/files/${fileName.replace(/\s+/g, '-')}`
    };
    this.uploadedFiles.unshift(mockFile);
    this.files = this.files.filter(f => f.name !== fileName);
    delete this.uploadProgress[fileName];
  }

  removeFile(fileName: string): void {
    this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== fileName);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onUpload(): void {
    if (this.files.length === 0) {
      alert('Por favor seleccione archivos para subir');
      return;
    }
    for (const file of this.files) {
      this.uploadProgress[file.name] = 0;
      this.simulateUploadProgress(file.name);
    }
  }

  onCancel(): void {
    this.files = [];
    this.uploadProgress = {};
  }
}