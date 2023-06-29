import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../files.service';
import { File } from '../interfaces/fileInterfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { faPlus, faCheck, faX } from '@fortawesome/free-solid-svg-icons';

@UntilDestroy()
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}

  faPlus = faPlus;
  faCheck = faCheck;
  faX = faX;

  userEmail = localStorage.getItem('email');

  public files: File[] = [];
  public newFolderInputShown = false;
  public newFileInputShown = false;
  public imageUrl: string | null | ArrayBuffer = '';
  public folderName = '';
  public folderMoveOptions: {
    type: 'move' | 'copy';
    url: string;
    file: File;
  } | null = null;
  public file: null | globalThis.File = null;

  onAddFolderClick() {
    this.newFolderInputShown = true;
  }

  onAddFileClick() {
    this.newFileInputShown = true;
  }

  onCloseAddFolderClick() {
    this.newFolderInputShown = false;
  }

  onCloseAddFileClick() {
    this.newFileInputShown = false;
    this.imageUrl = '';
  }

  onSelectFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.file = target.files[0];
      if (this.file.type.startsWith('image')) {
        const reader = new FileReader();

        reader.readAsDataURL(this.file);
        reader.onload = (event) => {
          if (event.target) {
            this.imageUrl = event.target.result;
          }
        };
      }
    }
  }

  onUploadClick() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('filePath', this.router.url);
      this.fileService
        .uploadFile(formData)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.newFileInputShown = false;
            this.imageUrl = '';
            this.fileService
              .getFiles(this.router.url)
              .pipe(untilDestroyed(this))
              .subscribe();
          },
        });
    }
  }

  onFolderMove(event: { type: 'move' | 'copy'; url: string; file: File }) {
    this.folderMoveOptions = event;
  }

  onMoveClick() {
    if (this.router.url === this.folderMoveOptions?.url) {
      return;
    }
    if (this.folderMoveOptions) {
      this.fileService
        .moveFolder(
          this.folderMoveOptions.type,
          this.router.url,
          this.folderMoveOptions.file._id,
          !!this.folderMoveOptions.file.mimeType
        )
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.folderMoveOptions = null;
            this.fileService
              .getFiles(this.router.url)
              .pipe(untilDestroyed(this))
              .subscribe();
          },
        });
    }
  }

  onAddFolderSubmit() {
    if (!this.folderName) {
      return;
    }
    this.fileService
      .addFolder(this.router.url, this.folderName)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.newFolderInputShown = false;
          this.folderName = '';
          this.fileService
            .getFiles(this.router.url)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res) => {
                this.files = res;
              },
            });
        },
      });
  }

  onLogout() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  ngOnInit(): void {
    this.fileService.files.pipe(untilDestroyed(this)).subscribe({
      next: (data) => {
        this.files = data;
      },
    });

    this.route.url.subscribe({
      next: (url) => {
        let urlPath = url.reduce((acc, el) => (acc += `/${el.path}`), '');
        this.fileService
          .getFiles(urlPath)
          .pipe(untilDestroyed(this))
          .subscribe();
      },
    });
  }
}
