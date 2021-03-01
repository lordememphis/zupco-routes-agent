import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  name: string;
  rauth: boolean;

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this.name = this._auth.name;
    this.rauth = this._auth.rauthenticated;
  }

  logout(): void {
    this._auth.logout();
  }
}
