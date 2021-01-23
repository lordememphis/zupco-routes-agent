import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Device } from '../shared/device';
import { GetResponse } from '../shared/response';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private _http: HttpClient) {}

  devices$ = this._http
    .get<GetResponse>(`${environment.AGENT_SERVICE()}devices/7/0/10`)
    .pipe(
      map((data) => {
        return {
          devices: data.content,
          empty: data.empty,
          total: data.totalElements,
        };
      })
    ) as Observable<{ devices: Device[]; empty: boolean; total: number }>;

  public registerDevice(device: Device): Observable<Object> {
    const { id, ...d } = device;
    return this._http.post(`${environment.AGENT_SERVICE()}device`, d);
  }

  public getMinimalDevice(id: number): Observable<Object> {
    return this._http.get(`${environment.AGENT_SERVICE()}device/${id}`);
  }

  public getDetailedDevice(id: number): Observable<Object> {
    return this._http.get(
      `${environment.AGENT_SERVICE()}retrieve-device/${id}`
    );
  }

  public updateDevice(device: Device): Observable<Object> {
    return this._http.put(`${environment.AGENT_SERVICE()}device`, device);
  }

  public deleteDevice(id: number): Observable<Object> {
    return this._http.delete(`${environment.AGENT_SERVICE()}device/${id}`);
  }
}
