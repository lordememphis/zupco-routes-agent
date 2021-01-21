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
export class OperatorService {
  private _env = environment;

  constructor(private _http: HttpClient) {}

  public registerOperator(operator: Operator): Observable<Object> {
    const { id, ...op } = operator;
    return this._http.post(`${this._env.AGENT_SERVICE()}operator`, op);
  }

  public getMinimalOperator(id: number): Observable<Object> {
    return this._http.get(`${this._env.AGENT_SERVICE()}operator/${id}`);
  }

  public getDetailedOperator(id: number): Observable<Object> {
    return this._http.get(
      `${this._env.AGENT_SERVICE()}retrieve-operator/${id}`
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

  public updateOperator(operator: Operator): Observable<Object> {
    return this._http.put(`${this._env.AGENT_SERVICE()}operator`, operator);
  }

  public deleteOperator(id: number): Observable<Object> {
    return this._http.delete(`${this._env.AGENT_SERVICE()}operator/${id}`);
  }
}
