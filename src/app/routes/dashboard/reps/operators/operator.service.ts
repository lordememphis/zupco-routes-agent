import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Operator } from 'src/app/shared/models/operator.model';
import { GetResponse } from 'src/app/shared/models/response.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OperatorService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  registerOperator(operator: Operator): Observable<boolean> {
    const { id, agent, ...op } = operator;
    return this.http
      .post(`${environment.AGENT_SERVICE()}operator`, {
        ...op,
        agentId: this.auth.agentId,
      })
      .pipe(map(() => true));
  }

  getOperators(): Observable<{
    operators: Operator[] | any[];
    empty: boolean;
    total: number;
  }> {
    return this.http
      .get<GetResponse>(
        `${environment.AGENT_SERVICE()}operators/${this.auth.agentId}/0/10`
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

  getMinimalOperator(id: number): Observable<any> {
    return this.http.get(`${environment.AGENT_SERVICE()}operator/${id}`);
  }

  getDetailedOperator(id: number): Observable<any> {
    return this.http.get(
      `${environment.AGENT_SERVICE()}retrieve-operator/${id}`
    );
  }

  updateOperator(operator: Operator): Observable<boolean> {
    const { agent, ...op } = operator;
    return this.http
      .put(`${environment.AGENT_SERVICE()}operator`, {
        ...op,
        agentId: this.auth.agentId,
      })
      .pipe(map(() => true));
  }

  deleteOperator(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.AGENT_SERVICE()}operator/${id}`)
      .pipe(map(() => true));
  }

  changePassword(
    oldPassword: string,
    newPassword: string,
    username: string
  ): Observable<any> {
    if (this.auth.rauthenticated)
      return this.http.post(
        `${environment.USER_SERVICE()}user/change-password`,
        {
          oldPassword,
          matchingPassword: newPassword,
          newPassword,
        }
      );
    return this.http.put(`${environment.AGENT_SERVICE()}operator-change-code`, {
      id: this.auth.operatorId,
      username,
      oldPassword,
      matchingPassword: newPassword,
      newPassword,
    });
  }
}
