import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
import { OperatorService } from '../../dashboard/reps/operators/operator.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, OnDestroy {
  changePasswordForm: FormGroup;
  rauth: boolean;
  error = false;
  warning = false;
  success = false;
  aMessage: string;
  processing = false;
  showPassword = false;
  showNewPassword = false;
  showMatchingPassword = false;
  private subs = new SubSink();

  constructor(
    private operatorService: OperatorService,
    private auth: AuthService,
    titleService: Title
  ) {
    titleService.setTitle('Account Settings');
  }

  ngOnInit(): void {
    this.rauth = this.auth.rauthenticated;
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      matchingPassword: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
    });

    if (this.rauth)
      this.changePasswordForm.patchValue({ username: 'username' });
  }

  changePassword(): void {
    const o = this.changePasswordForm.get('oldPassword').value;
    const n = this.changePasswordForm.get('newPassword').value;
    const m = this.changePasswordForm.get('matchingPassword').value;
    const u = this.changePasswordForm.get('username').value;

    if (n !== m) {
      this.warning = true;
      this.aMessage = 'Password mismatch. Enter new passwords again.';

      setTimeout(() => {
        this.warning = false;
      }, 5000);
      return;
    }

    this.processing = true;

    this.subs.add(
      this.operatorService.changePassword(o, n, u).subscribe(
        (res) => {
          console.log(res);
          this.processing = false;
          this.success = true;
          this.aMessage = 'Password changed successfully.';

          setTimeout(() => {
            this.success = false;
          }, 5000);
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
