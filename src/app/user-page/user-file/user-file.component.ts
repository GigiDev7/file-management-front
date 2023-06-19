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
    currentUrl: string;
    folderName: string;
    isFolder: boolean;
    isFile: boolean;
  }>();

  faFolder = faFolder;
  faFile = faFile;
  faGear = faGear;

  public isSettingOpen = false;

  onMoveFolder(type: 'move' | 'copy') {
    const folderName = this.file.path.split('\\').at(-1) as string;
    this.isSettingOpen = false;
    this.moveFolder.emit({
      type,
      currentUrl: this.router.url,
      folderName,
      isFile: this.file.file,
      isFolder: this.file.dir,
    });
  }

  onSettingToggle() {
    this.isSettingOpen = !this.isSettingOpen;
  }

  onDeleteHandler() {
    if (this.file.dir) {
      this.deleteFolder();
    } else {
      this.deleteFile();
    }
  }

  onDownloadHandler() {
    const filePath = this.file.path.split('\\').at(-1);
    this.fileService
      .downloadFile(this.router.url, filePath as string)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          let downloadUrl = window.URL.createObjectURL(res);
          saveAs(downloadUrl);
        },
      });
  }

  deleteFolder() {
    const folderName = this.file.path.split('\\').at(-1) as string;
    this.fileService
      .deleteFolder(this.router.url, folderName)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.isSettingOpen = false;
          this.fileService
            .getDirectories(this.router.url)
            .pipe(untilDestroyed(this))
            .subscribe();
        },
      });
  }

  deleteFile() {
    const fileName = this.file.path.split('\\').at(-1) as string;
    const filePath = `${this.router.url}${
      this.router.url.length > 1 ? '/' : ''
    }${fileName}`;
    this.fileService
      .deleteFile(filePath)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.isSettingOpen = false;
          this.fileService
            .getDirectories(this.router.url)
            .pipe(untilDestroyed(this))
            .subscribe();
        },
      });
  }
}
