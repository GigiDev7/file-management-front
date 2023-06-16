import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    /*  this.http
      .get('http://localhost:8000/file/test', { responseType: 'blob' })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          let fileReader = new FileReader();
          fileReader.onload = (e) => {
            console.log(fileReader.result);
          };
          fileReader.readAsText(res);
        },
    file-1686648218896.txt
    file-1686652874012.jpg
    file-1686653313957.pdf
      }); */
    /* this.http
      .get('http://localhost:8000/ftp/uploads/file-1686653313957.pdf', {
        responseType: 'blob',
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          let fileReader = new FileReader();
          fileReader.onload = (e) => {
            console.log(fileReader.result);
          };
          //fileReader.readAsText(res);
          fileReader.readAsDataURL(res);
        },
      }); */
  }
}
