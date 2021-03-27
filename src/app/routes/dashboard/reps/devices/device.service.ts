import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Device } from 'src/app/shared/models/device.model';
import { GetResponse } from 'src/app/shared/models/response.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  registerDevice(device: Device): Observable<boolean> {
    const { id, agent, ...d } = device;
    return this.http
      .post(`${environment.AGENT_SERVICE()}device`, {
        ...d,
        agentId: this.auth.agentId,
      })
      .pipe(map(() => true));
  }

  getDevices(): Observable<{
    devices: any[] | Device[];
    empty: boolean;
    total: number;
  }> {
    return this.http
      .get<GetResponse>(
        `${environment.AGENT_SERVICE()}devices/${this.auth.agentId}/0/999`
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

  getMinimalDevice(id: number): Observable<any> {
    return this.http.get(`${environment.AGENT_SERVICE()}device/${id}`);
  }

  getDetailedDevice(id: number): Observable<any> {
    return this.http.get(`${environment.AGENT_SERVICE()}retrieve-device/${id}`);
  }

  updateDevice(device: Device): Observable<boolean> {
    const { agent, ...d } = device;
    return this.http
      .put(`${environment.AGENT_SERVICE()}device`, {
        ...d,
        agentId: this.auth.agentId,
      })
      .pipe(map(() => true));
  }

  deleteDevice(id: number): Observable<boolean> {
    return this.http
      .delete(`${environment.AGENT_SERVICE()}device/${id}`)
      .pipe(map(() => true));
  }
}
