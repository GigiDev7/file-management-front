import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string) {
    return this.http.post<{ email: string; token: string }>(
      `${BASE_URL}/auth/signin`,
      { email, password }
    );
  }

  public register(email: string, password: string) {
    return this.http.post(`${BASE_URL}/auth/signup`, { email, password });
  }
}
