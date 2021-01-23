import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface GetResponse {
  content: Operator[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}

export interface Operator {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  status: string;
  agent: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class OperatorService {
  constructor(private _http: HttpClient) {}

  operators$ = this._http
    .get<GetResponse>(`${environment.AGENT_SERVICE()}operators/7/0/10`)
    .pipe(
      map((data) => {
        return {
          operators: data.content,
          empty: data.empty,
          total: data.totalElements,
        };
      })
    ) as Observable<{ operators: Operator[]; empty: boolean; total: number }>;

  registerOperator(operator: Operator): Observable<Object> {
    const { id, ...op } = operator;
    return this._http.post(`${environment.AGENT_SERVICE()}operator`, op);
  }

  getMinimalOperator(id: number): Observable<Object> {
    return this._http.get(`${environment.AGENT_SERVICE()}operator/${id}`);
  }

  getDetailedOperator(id: number): Observable<Object> {
    return this._http.get(
      `${environment.AGENT_SERVICE()}retrieve-operator/${id}`
    );
  }

  updateOperator(operator: Operator): Observable<Object> {
    return this._http.put(`${environment.AGENT_SERVICE()}operator`, operator);
  }

  deleteOperator(id: number): Observable<Object> {
    return this._http.delete(`${environment.AGENT_SERVICE()}operator/${id}`);
  }
}
