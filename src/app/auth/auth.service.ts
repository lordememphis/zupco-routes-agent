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
  constructor(private http: HttpClient, private router: Router) {}

  get authenticated(): boolean {
    return sessionStorage.getItem('oauth') !== null;
  }

  get rauthenticated(): boolean {
    return sessionStorage.getItem('rauth') !== null;
  }

  get token(): string {
    return sessionStorage.getItem('token');
  }

  get name(): string {
    return sessionStorage.getItem('user');
  }

  get agentId(): number {
    return Number(sessionStorage.getItem('auid'));
  }

  get userId(): number {
    return Number(sessionStorage.getItem('uuid'));
  }

  get operatorId(): number {
    return Number(sessionStorage.getItem('ouid'));
  }

  get agentMobile(): string {
    return sessionStorage.getItem('mobile');
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${environment.OAUTH_SERVICE()}login`, {
        username,
        password,
      })
      .pipe(
        map((data) => {
          if (!data.agentId) return false;
          return this.http
            .get<any>(
              `${environment.AGENT_SERVICE()}retrieve-agent/${data.agentId}`
            )
            .subscribe((agent) => {
              if (data.roles[0].name === 'ROLE_AGENT_ADMIN')
                sessionStorage.setItem('rauth', 'true');
              sessionStorage.setItem('oauth', 'true');
              sessionStorage.setItem('token', data.access_token);
              sessionStorage.setItem(
                'user',
                `${data.firstName} ${data.lastName}`
              );
              sessionStorage.setItem('auid', `${data.agentId}`);
              sessionStorage.setItem('uuid', `${data.id}`);
              sessionStorage.setItem('ouid', `${data.clientId}`);
              sessionStorage.setItem('mobile', agent.mobile);
            });
        })
      );
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  sendResetPasswordToken(email: string): Observable<boolean> {
    return this.http
      .post(
        `${environment.USER_SERVICE()}user/resetPassword?email=${email}`,
        null
      )
      .pipe(map(() => true));
  }

  resetPassword(token: string, password: string): Observable<boolean> {
    return this.http
      .post(`${environment.USER_SERVICE()}user/savePassword`, {
        token,
        newPassword: password,
      })
      .pipe(map(() => true));
  }
}
