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

  getDirectories(path: string = '') {
    return this.http.get<File[]>(`${BASE_URL}/file/dirs?p=${path}`).pipe(
      tap((res) => {
        this.files.next(res);
      })
    );
  }

  addFolder(path: string = '', folderName: string) {
    return this.http.post(`${BASE_URL}/file/dirs?p=${path}`, { folderName });
  }

  deleteFolder(path: string = '', folderName: string) {
    return this.http.post(`${BASE_URL}/file/dirs/remove?p=${path}`, {
      folderName,
    });
  }

  moveFolder(
    type: 'copy' | 'move',
    sourcePath: string,
    destinationPath: string,
    folderName: string,
    isFolder: boolean
  ) {
    let url = `${BASE_URL}/file`;
    if (isFolder) {
      url += `/dirs/${type}`;
    } else {
      url += `/${type}`;
    }
    return this.http.post(url, {
      sourcePath: `${sourcePath}${
        sourcePath.length > 1 ? '/' : ''
      }${folderName}`,
      destinationPath: `${destinationPath}${
        destinationPath.length > 1 ? '/' : ''
      }${folderName}`,
    });
  }

  downloadFile(path: string = '', fileName: string) {
    return this.http.get(`${BASE_URL}/file/download?p=${path}/${fileName}`, {
      responseType: 'blob',
    });
  }

  deleteFile(path: string) {
    return this.http.post(`${BASE_URL}/file/delete`, {
      filePath: path,
    });
  }

  uploadFile(formData: FormData, urlPath: string) {
    return this.http.post(`${BASE_URL}/file/upload?p=${urlPath}`, formData);
  }
}
