import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  form: FormGroup;

  error = false;
  aMessage: string;
  aTitle = 'Login failed';
  processing = false;
  showPassword = false;

  constructor(private _router: Router, private _auth: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  login() {
    const u = this.form.get('username').value;
    const p = this.form.get('password').value;

    this.processing = true;

    this._subs.add(
      this._auth.login(u, p).subscribe(
        (authenticated) => {
          if (authenticated) {
            setTimeout(() => {
              this._router.navigate(['dashboard']);
              this.processing = false;
            }, 1000);
          } else {
            this.error = true;
            this.aMessage =
              'This account was created using an unverified merchant, and is therefore invalid and cannot be used to login. Ask your administrator to create a new account for you.';

            setTimeout(() => {
              this.error = false;
            }, 8000);
          }
        },
        (e) => {
          this.processing = false;
          this.error = true;

          if (!e.response)
            this.aMessage =
              'The server cannot be reached at the moment. Check your internet connection and try again later';
          else if (e.error.message) this.aMessage = e.error.message;
          else this.aMessage = 'Something went wrong. Try again';

          setTimeout(() => {
            this.error = false;
          }, 5000);
        }
      )
    );
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
