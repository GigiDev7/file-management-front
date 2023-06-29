import { Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from 'src/app/interfaces/fileInterfaces';
import { faFolder, faFile, faGear } from '@fortawesome/free-solid-svg-icons';
import { FileService } from 'src/app/files.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@UntilDestroy()
@Component({
  selector: 'app-user-file',
  templateUrl: './user-file.component.html',
  styleUrls: ['./user-file.component.css'],
})
export class UserFileComponent {
  constructor(private fileService: FileService, private router: Router) {}

  @Input() file!: File;

  @Output() moveFolder = new EventEmitter<{
    type: 'move' | 'copy';
    url: string;
    file: File;
  }>();

  faFolder = faFolder;
  faFile = faFile;
  faGear = faGear;

  public isSettingOpen = false;

  onMoveFolder(type: 'move' | 'copy') {
    this.isSettingOpen = false;
    this.moveFolder.emit({
      type,
      url: this.router.url,
      file: this.file,
    });
  }

  onSettingToggle() {
    this.isSettingOpen = !this.isSettingOpen;
  }

  onDeleteHandler(fileId: string) {
    if (!this.file.mimeType) {
      this.deleteFolder(fileId);
    } else {
      this.deleteFile(fileId);
    }
  }

  onDownloadHandler() {
    this.fileService
      .downloadFile(this.file._id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          let downloadUrl = window.URL.createObjectURL(res);
          saveAs(downloadUrl);
        },
      });
  }

  deleteFolder(folderId: string) {
    this.fileService
      .deleteFolder(folderId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.isSettingOpen = false;
          this.fileService
            .getFiles(this.router.url)
            .pipe(untilDestroyed(this))
            .subscribe();
        },
      });
  }

  deleteFile(fileId: string) {
    this.fileService
      .deleteFile(fileId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.isSettingOpen = false;
          this.fileService
            .getFiles(this.router.url)
            .pipe(untilDestroyed(this))
            .subscribe();
        },
      });
  }
}
