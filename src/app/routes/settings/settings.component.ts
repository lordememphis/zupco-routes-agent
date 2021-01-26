import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { OperatorService } from '../operator.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  changePasswordForm: FormGroup;

  error = null;
  warning = null;
  success = null;

  constructor(private _operatorService: OperatorService) {}

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      matchingPassword: new FormControl(null, Validators.required),
    });
  }

  changePassword() {
    const o = this.changePasswordForm.get('oldPassword').value;
    const n = this.changePasswordForm.get('newPassword').value;
    const m = this.changePasswordForm.get('matchingPassword').value;

    if (n !== m) {
      this.warning = 'Password mismatch. Enter new passwords again.';
      this._clearAlerts();
      return;
    }

    this._subs.add(
      this._operatorService.changePassword(o, n).subscribe(
        (res) => {
          console.log(res);
          this.success = 'Password changed successfully.';
          this._clearAlerts();
        },
        (e) => {
          e.error.message
            ? (this.error = e.error.message)
            : (this.error = 'Something went wrong. Try again.');
          this._clearAlerts();
        }
      )
    );
  }

  private _clearAlerts() {
    setTimeout(() => {
      this.error = null;
      this.warning = null;
      this.success = null;
    }, 5000);
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
