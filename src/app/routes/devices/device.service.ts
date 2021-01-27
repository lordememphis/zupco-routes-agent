import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Device } from 'src/app/shared/models/device';
import { GetResponse } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private _http: HttpClient, private _auth: AuthService) {}

  registerDevice(device: Device): Observable<Object> {
    const { id, agent, ...d } = device;
    return this._http
      .post(`${environment.AGENT_SERVICE()}device`, {
        ...d,
        agentId: this._auth.agentId,
      })
      .pipe(map(() => true));
  }

  getDevices(): Observable<{
    devices: any[] | Device[];
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
            devices: data.content,
            empty: data.empty,
            total: data.totalElements,
          };
        })
      );
  }

  getMinimalDevice(id: number): Observable<Object> {
    return this._http.get(`${environment.AGENT_SERVICE()}device/${id}`);
  }

  getDetailedDevice(id: number): Observable<Object> {
    return this._http.get(
      `${environment.AGENT_SERVICE()}retrieve-device/${id}`
    );
  }

  updateDevice(device: Device): Observable<Object> {
    return this._http.put(`${environment.AGENT_SERVICE()}device`, device);
  }

  deleteDevice(id: number): Observable<Object> {
    return this._http.delete(`${environment.AGENT_SERVICE()}device/${id}`);
  }
}
