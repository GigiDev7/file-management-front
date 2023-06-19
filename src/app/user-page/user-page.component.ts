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

  public dirs: File[] = [];
  public newFolderInputShown = false;
  public newFileInputShown = false;
  public imageUrl: string | null | ArrayBuffer = '';
  public folderName = '';
  public folderMoveOptions: {
    type: 'move' | 'copy';
    currentUrl: string;
    folderName: string;
    isFile: boolean;
    isFolder: boolean;
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
      this.fileService
        .uploadFile(formData, this.router.url)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.newFileInputShown = false;
            this.fileService
              .getDirectories(this.router.url)
              .pipe(untilDestroyed(this))
              .subscribe();
          },
        });
    }
  }

  onFolderMove(event: {
    type: 'move' | 'copy';
    currentUrl: string;
    folderName: string;
    isFile: boolean;
    isFolder: boolean;
  }) {
    this.folderMoveOptions = event;
  }

  onMoveClick() {
    if (this.router.url === this.folderMoveOptions?.currentUrl) {
      return;
    }
    if (this.folderMoveOptions) {
      this.fileService
        .moveFolder(
          this.folderMoveOptions.type,
          this.folderMoveOptions.currentUrl,
          this.router.url,
          this.folderMoveOptions.folderName,
          this.folderMoveOptions.isFolder
        )
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.folderMoveOptions = null;
            this.fileService
              .getDirectories(this.router.url)
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
            .getDirectories(this.router.url)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res) => {
                this.dirs = res;
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
      next: (f) => {
        this.dirs = f;
      },
    });

    this.route.url.subscribe({
      next: (url) => {
        let urlPath = url.reduce((acc, el) => (acc += `/${el.path}`), '');
        this.fileService
          .getDirectories(urlPath)
          .pipe(untilDestroyed(this))
          .subscribe();
      },
    });
  }
}
