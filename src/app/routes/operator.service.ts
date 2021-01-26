import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Operator } from '../shared/operator';
import { GetResponse } from '../shared/response';

@Injectable({
  providedIn: 'root',
})
export class OperatorService {
  constructor(private _http: HttpClient, private _auth: AuthService) {}

  registerOperator(operator: Operator): Observable<Object> {
    const { id, ...op } = operator;
    return this._http.post(`${environment.AGENT_SERVICE()}operator`, op);
  }

  getOperators(): Observable<{
    operators: Operator[] | any[];
    empty: boolean;
    total: number;
  }> {
    return this._http
      .get<GetResponse>(
        `${environment.AGENT_SERVICE()}devices/${this._auth.agentId}/0/10`
      )
      .pipe(
        map((data) => {
          return {
            operators: data.content,
            empty: data.empty,
            total: data.totalElements,
          };
        })
      );
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

  changePassword(old: string, newPassword: string): Observable<Object> {
    return this._http.post(
      `${environment.USER_SERVICE()}user/change-password`,
      {
        oldPassword: old,
        matchingPassword: newPassword,
        newPassword: newPassword,
      }
    );
  }
}
