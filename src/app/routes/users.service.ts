import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Operator {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  status: string;
  agent: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _env = environment;

  constructor(private _http: HttpClient) {}

  public users(): Observable<Object> {
    return this._http.get<any>(`${this._env.USER_SERVICE()}s/0/10`).pipe(
      map((data) => {
        return { users: data.content };
      })
    );
  }

  public getOperators(): Observable<Object> {
    return this._http
      .get<any>(`${this._env.AGENT_SERVICE()}operators/7/0/10`)
      .pipe(
        map((data) => {
          return { operators: data.content };
        })
      );
  }

  public registerOperator(operator: Operator): Observable<Object> {
    const { id, ...op } = operator;
    return this._http.post(`${this._env.AGENT_SERVICE()}operator`, op);
  }
}
