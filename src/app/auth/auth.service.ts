import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authenticated = false;
  private _env = environment;

  constructor(private _http: HttpClient) {}

  get authenticated(): boolean {
    return this._authenticated;
  }

  public login(username: string, password: string): Observable<Object> {
    return this._http.post(`${this._env.BASE_URL}login`, {
      username: username,
      password: password,
    });
  }
}
