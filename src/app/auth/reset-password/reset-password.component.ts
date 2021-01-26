import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  sendTokenForm: FormGroup;
  resetPasswordForm: FormGroup;

  error = null;
  warning = null;
  success = null;
  processing = false;
  resetting = false;

  token: string;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._subs.add(
      this._route.queryParams.subscribe((params) => {
        if (params['token']) {
          this.token = params['token'];
          this.resetting = true;
        }
      })
    );

    this.sendTokenForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

    this.resetPasswordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      matchingPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSendToken() {
    this.processing = true;
    this._subs.add(
      this._auth
        .sendResetPasswordToken(this.sendTokenForm.get('email').value)
        .subscribe(
          (res) => {
            this.processing = false;
            console.log(res);
            this.success = 'A reset token has been sent to the email you .';
            setTimeout(() => {
              this.success = null;
              this.resetting = true;
            }, 2000);
          },
          (e) => {
            this.processing = false;
            e.error.message
              ? (this.error = e.error.message)
              : (this.error = 'Something went wrong. Try again.');

            setTimeout(() => {
              this.error = false;
            }, 5000);
          }
        )
    );
  }

  onSavePassword() {
    this.processing = true;

    const p = this.resetPasswordForm.get('password').value;
    const mp = this.resetPasswordForm.get('matchingPassword').value;

    if (p !== mp) {
      this.warning = 'Passwords do not match.';
      setTimeout(() => {
        this.warning = null;
      }, 5000);
      return;
    }

    this._subs.add(
      this._auth.resetPassword(this.token, p).subscribe(
        (res) => {
          this.processing = false;
          console.log(res);
          this.success =
            'Your password has been reset successfully. You can now login with your new password.';
          setTimeout(() => {
            this.success = null;
            this._router.navigate(['login']);
          }, 2000);
        },
        (e) => {
          this.processing = false;
          e.error.message
            ? (this.error = e.error.message)
            : (this.error = 'Something went wrong. Try again.');

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
