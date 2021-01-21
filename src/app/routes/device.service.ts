import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Device {
  id: number;
  imei: string;
  type: string;
  status: string;
  agent: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private _env = environment;

  constructor(private _http: HttpClient) {}

  public registerDevice(device: Device): Observable<Object> {
    const { id, ...d } = device;
    return this._http.post(`${this._env.AGENT_SERVICE()}device`, d);
  }

  public getMinimalDevice(id: number): Observable<Object> {
    return this._http.get(`${this._env.AGENT_SERVICE()}device/${id}`);
  }

  public getDetailedDevice(id: number): Observable<Object> {
    return this._http.get(`${this._env.AGENT_SERVICE()}retrieve-device/${id}`);
  }

  public getDevices(): Observable<Object> {
    return this._http.get(`${this._env.AGENT_SERVICE()}devices/7/0/10`);
  }

  public updateDevice(device: Device): Observable<Object> {
    return this._http.put(`${this._env.AGENT_SERVICE()}device`, device);
  }

  public deleteDevice(id: number): Observable<Object> {
    return this._http.delete(`${this._env.AGENT_SERVICE()}device/${id}`);
  }
}
