import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authenticated = false;

  constructor() {}

  get authenticated(): boolean {
    return this._authenticated;
  }
}
