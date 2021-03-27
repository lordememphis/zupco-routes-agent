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

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.name = this.auth.name;
    this.rauth = this.auth.rauthenticated;
  }

  logout(): void {
    this.auth.logout();
  }
}
