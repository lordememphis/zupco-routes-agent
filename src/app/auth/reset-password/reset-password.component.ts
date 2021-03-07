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

  error = false;
  warning = false;
  success = false;
  processing = false;
  resetting = false;
  aMessage: string;

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
      email: new FormControl(null, Validators.required),
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
          () => {
            this.processing = false;
            this.success = true;
            this.aMessage =
              'A reset token has been sent to the email you provided. Please check your email and click the link with your password reset token to reset your password.';
          },
          (e) => {
            if (!e.response)
              this._onReqError(
                'The server cannot be reached at the moment. Check your internet connection and try again later'
              );
            e.error.message
              ? this._onReqError(e.error.message)
              : this._onReqError('Something went wrong. Try again.');
          }
        )
    );
  }

  onSavePassword() {
    const p = this.resetPasswordForm.get('password').value;
    const mp = this.resetPasswordForm.get('matchingPassword').value;

    if (p !== mp) {
      this.warning = true;
      this.aMessage = 'Passwords do not match.';

      setTimeout(() => {
        this.warning = false;
      }, 5000);

      return;
    }

    this.processing = true;

    this._subs.add(
      this._auth.resetPassword(this.token, p).subscribe(
        () => {
          this._onReqSuccess(
            'Your password has been reset successfully. You now login using your newly set password.'
          );
        },
        (e) => {
          if (!e.response) {
            this._onReqError(
              'The server cannot be reached at the moment. Check your internet connection and try again later'
            );
            return;
          }
          e.error.message
            ? this._onReqError(e.error.message)
            : this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  private _onReqSuccess(message: string) {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
      this._router.navigate(['login']);
    }, 3000);
  }

  private _onReqError(message: string) {
    this.processing = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
