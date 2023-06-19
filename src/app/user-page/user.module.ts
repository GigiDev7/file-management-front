import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserFileComponent } from './user-file/user-file.component';
import { UserPageComponent } from './user-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UserFileComponent, UserPageComponent],
  imports: [FontAwesomeModule, FormsModule, CommonModule, RouterModule],
  providers: [],
})
export class UserModule {}
