import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Operator } from 'src/app/shared/models/operator';
import { GetResponse } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OperatorService {
  constructor(private _http: HttpClient, private _auth: AuthService) {}

  registerOperator(operator: Operator): Observable<Object> {
    const { id, agent, ...op } = operator;
    return this._http
      .post(`${environment.AGENT_SERVICE()}operator`, {
        ...op,
        agentId: this._auth.agentId,
      })
      .pipe(map(() => true));
  }

  getOperators(): Observable<{
    operators: Operator[] | any[];
    empty: boolean;
    total: number;
  }> {
    return this._http
      .get<GetResponse>(
        `${environment.AGENT_SERVICE()}operators/${this._auth.agentId}/0/10`
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
    const { agent, ...op } = operator;
    return this._http
      .put(`${environment.AGENT_SERVICE()}operator`, {
        ...op,
        agentId: this._auth.agentId,
      })
      .pipe(map(() => true));
  }

  deleteOperator(id: number): Observable<Object> {
    return this._http
      .delete(`${environment.AGENT_SERVICE()}operator/${id}`)
      .pipe(map(() => true));
  }

  changePassword(
    old: string,
    newPassword: string,
    username: string
  ): Observable<Object> {
    if (this._auth.rauthenticated)
      return this._http.post(
        `${environment.USER_SERVICE()}user/change-password`,
        {
          oldPassword: old,
          matchingPassword: newPassword,
          newPassword: newPassword,
        }
      );
    return this._http.put(
      `${environment.AGENT_SERVICE()}/operator-change-code`,
      {
        id: this._auth.userId,
        username: username,
        oldPassword: old,
        matchingPassword: newPassword,
        newPassword: newPassword,
      }
    );
  }
}
