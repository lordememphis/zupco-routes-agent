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
  alert = null;

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

    this._auth.login(u, p).subscribe(
      (res) => {
        console.log(res);
        this._router.navigate(['dashboard']);
      },
      (e) => {
        if (e.status === 404)
          this.alert =
            'You have used an incorrect username or password. Try again.';
        else this.alert = 'Something has gone wrong. Try again.';

        setTimeout(() => {
          this.alert = null;
        }, 5000);
      }
    );
  }
}
