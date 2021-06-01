import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

export interface ICreateSubscriberProfileDto {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriberService {
  constructor(private http: HttpClient) {}

  registerSubscriber(dto: ICreateSubscriberProfileDto): Observable<any> {
    return this.http
      .post(`${environment.SUBSCRIBER_SERVICE()}subscriberprofile`, dto)
      .pipe(map((data) => data));
  }
}
