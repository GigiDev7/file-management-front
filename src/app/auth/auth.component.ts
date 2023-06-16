import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {}

  public authForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl(''),
  });

  public loading: boolean = false;
  public validationError: string = '';

  onFormSubmit() {
    if (!this.authForm.valid) {
      this.validationError = 'Please fill all fields';
      return;
    }
    const { email, password, confirmPassword } = this.authForm.value;
    if (this.authType === 'register' && password !== confirmPassword) {
      this.validationError = 'Passwords do not match';
      return;
    }

    this.loading = true;
    if (this.authType === 'login') {
      this.authService
        .login(email, password)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('email', res.email);
            this.router.navigate(['']);
          },
          error: (err) => {
            this.loading = false;
            console.log(err);
          },
        });
    } else {
      this.authService
        .register(email, password)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res) => {
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            this.loading = false;
            console.log(err);
          },
        });
    }
  }

  @Input() authType!: 'login' | 'register';
}
