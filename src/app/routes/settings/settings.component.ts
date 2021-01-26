import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { OperatorService } from '../operators/operator.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  changePasswordForm: FormGroup;

  error = false;
  warning = false;
  success = false;
  aMessage: string;
  processing = false;

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
      this.warning = true;
      this.aMessage = 'Password mismatch. Enter new passwords again.';

      setTimeout(() => {
        this.warning = false;
      }, 5000);
      return;
    }

    this.processing = true;

    this._subs.add(
      this._operatorService.changePassword(o, n).subscribe(
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
          e.error.message
            ? (this.aMessage = e.error.message)
            : (this.aMessage = 'Something went wrong. Try again.');

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
