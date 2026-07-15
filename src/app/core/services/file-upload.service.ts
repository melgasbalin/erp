// src/app/core/services/file-upload.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface UploadedFile {
    id: number;
    name: string;
    type: string;
    size: number;
    url: string;
    uploadDate: string;
}

@Injectable({ providedIn: 'root' })
export class FileUploadService {
    private uploadedFiles: UploadedFile[] = [];

    upload(file: File): Observable<UploadedFile> {
        return of(file).pipe(
            delay(1000),
            map(f => {
                const uploaded: UploadedFile = {
                    id: Math.floor(Math.random() * 100000),
                    name: f.name,
                    type: f.type,
                    size: f.size,
                    url: `https://example.com/files/${f.name.replace(/\s+/g, '-')}`,
                    uploadDate: new Date().toISOString()
                };
                this.uploadedFiles.push(uploaded);
                return uploaded;
            })
        );
    }

    getAll(): Observable<UploadedFile[]> {
        return of(this.uploadedFiles).pipe(delay(200));
    }

    remove(id: number): void {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== id);
    }
}
