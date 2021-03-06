import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error = false;
  aMessage: string;
  aTitle = 'Login failed';
  processing = false;
  showPassword = false;
  private subs = new SubSink();

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  login(): void {
    const u = this.form.get('username').value;
    const p = this.form.get('password').value;

    this.processing = true;

    this.subs.add(
      this.auth.login(u, p).subscribe(
        (authenticated) => {
          if (authenticated) {
            setTimeout(() => {
              this.router.navigate(['dashboard']);
              this.processing = false;
            }, 1000);
          } else {
            this.error = true;
            this.aMessage =
              'This account was created using an unverified agent, and is therefore invalid and cannot be used to login. Ask your administrator to create a new account for you.';

            setTimeout(() => {
              this.error = false;
            }, 8000);
          }
        },
        (e) => {
          this.processing = false;
          this.error = true;

          if (!e.error) {
            this.aMessage =
              'The server cannot be reached at the moment. Check your internet connection and try again later';
          } else if (e.error.message) {
            this.aMessage = e.error.message;
          } else {
            this.aMessage = 'Something went wrong. Try again';
          }

          setTimeout(() => {
            this.error = false;
          }, 5000);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
