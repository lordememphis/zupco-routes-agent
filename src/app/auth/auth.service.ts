import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _router: Router) {}

  get authenticated(): boolean {
    return sessionStorage.getItem('oauth') !== null;
  }

  get token(): string {
    return sessionStorage.getItem('token');
  }

  get name(): string {
    return sessionStorage.getItem('user');
  }

  get agentId(): number {
    return parseInt(sessionStorage.getItem('auid'));
  }

  get userId(): number {
    return parseInt(sessionStorage.getItem('uuid'));
  }

  login(username: string, password: string): Observable<boolean> {
    return this._http
      .post<any>(`${environment.OAUTH_SERVICE()}login`, {
        username: username,
        password: password,
      })
      .pipe(
        map((data) => {
          sessionStorage.setItem('oauth', 'true');
          sessionStorage.setItem('token', data.access_token);
          sessionStorage.setItem('user', `${data.firstName} ${data.lastName}`);
          sessionStorage.setItem('auid', `${data.agentId}`);
          sessionStorage.setItem('uuid', `${data.id}`);

          return true;
        })
      );
  }

  logout() {
    sessionStorage.clear();
    this._router.navigate(['login']);
  }

  sendResetPasswordToken(email: string): Observable<Object> {
    return this._http.post(
      `${environment.USER_SERVICE()}user/resetPassword?email=${email}`,
      null
    );
  }

  resetPassword(token: string, password: string): Observable<Object> {
    return this._http.post(`${environment.USER_SERVICE()}user/savePassword`, {
      token: token,
      newPassword: password,
    });
  }
}
