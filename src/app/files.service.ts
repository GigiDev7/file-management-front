import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'src/config';
import { File } from './interfaces/fileInterfaces';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  files = new BehaviorSubject<File[]>([]);

  getFiles(path: string = '') {
    return this.http.get<File[]>(`${BASE_URL}/file?p=${path}`).pipe(
      tap((res) => {
        this.files.next(res);
      })
    );
  }

  addFolder(path: string = '', folderName: string) {
    return this.http.post(`${BASE_URL}/file/dir`, { folderName, path });
  }

  deleteFolder(folderId: string) {
    return this.http.delete(`${BASE_URL}/file/dir/${folderId}`);
  }

  moveFolder(
    type: 'copy' | 'move',
    destinationPath: string,
    fileId: string,
    isFile: boolean
  ) {
    let url = `${BASE_URL}/file/${type}/${fileId}`;
    if (!isFile) {
      url = `${BASE_URL}/file/dir/${type}/${fileId}`;
    }
    return this.http.post(url, { path: destinationPath });
  }

  downloadFile(fileId: string) {
    return this.http.get(`${BASE_URL}/file/${fileId}`, {
      responseType: 'blob',
    });
  }

  deleteFile(fileId: string) {
    return this.http.delete(`${BASE_URL}/file/${fileId}`);
  }

  uploadFile(formData: FormData) {
    return this.http.post(`${BASE_URL}/file`, formData);
  }
}
