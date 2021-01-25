import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  error = null;
  processing = false;

  constructor(private _router: Router, private _auth: AuthService) {}

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

    this._auth.login(u, p).subscribe(
      (authenticated) => {
        this.processing = false;

        if (authenticated) {
          this._router.navigate(['dashboard']);
        }
      },
      (e) => {
        this.processing = false;

        if (e.status === 404)
          this.error =
            'You have used an incorrect username or password. Try again.';
        else this.error = 'Something has gone wrong. Try again.';

        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    );
  }
}
