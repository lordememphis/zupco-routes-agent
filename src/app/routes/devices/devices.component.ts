import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Device } from 'src/app/shared/models/device';
import { SubSink } from 'subsink';
import { DeviceService } from './device.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  registerDeviceForm: FormGroup;
  editDeviceForm: FormGroup;

  devices: Device[] = [];
  device: Device;
  hasDevices: boolean;
  totalDevices: number;

  error = false;
  success = false;
  aMessage: string;
  processing = true;
  viewingDevices: boolean;
  registeringDevice: boolean;
  editingDevice: boolean;
  deletingDevice: boolean;
  fsDialog: boolean;

  constructor(private _deviceService: DeviceService, private _router: Router) {
    this._subs.add(
      this._router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
  }

  ngOnInit(): void {
    this.viewingDevices = true;
    this.registeringDevice = false;
    this.editingDevice = false;
    this.deletingDevice = false;
    this.fsDialog = false;

    this._subs.add(
      this._deviceService.getDevices().subscribe(
        (res) => {
          this.devices = res.devices;
          this.hasDevices = !res.empty;
          this.totalDevices = res.total;
          this.processing = false;
        },
        (e) => {
          this._onReqError('Something went wrong. Try again.');
        }
      )
    );

    this.editDeviceForm = new FormGroup({
      imei: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
    });

    this.registerDeviceForm = new FormGroup({
      imei: new FormControl(null, Validators.required),
      type: new FormControl('WEB', Validators.required),
    });
  }

  registerDevice(): void {
    this.processing = true;

    const device: Device = {
      id: null,
      imei: this.registerDeviceForm.get('imei').value,
      type: this.registerDeviceForm.get('type').value,
      status: 'ACTIVE',
      agent: 7,
    };

    this._subs.add(
      this._deviceService.registerDevice(device).subscribe(
        () => {
          this._onReqSuccess('The device has been registered successfully.');
        },
        (e) => {
          this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  onEditDevice(device: Device): void {
    this.device = device;
    this.editingDevice = true;
    this.fsDialog = true;

    this.editDeviceForm.patchValue({
      imei: device.imei,
      type: device.type,
    });
  }

  updateDevice(): void {
    this.processing = true;

    const d: Device = {
      id: this.device.id,
      imei: this.registerDeviceForm.get('imei').value,
      type: this.registerDeviceForm.get('type').value,
      status: this.device.status,
      agent: null,
    };

    this._subs.add(
      this._deviceService.updateDevice(d).subscribe(
        () => {
          this._onReqSuccess('The device has been updated successfully.');
        },
        (e) => {
          this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }
  changeDeviceStatus(device: Device) {
    this.processing = true;
    const { ...d } = device;

    device.status === 'ACTIVE' ? (d.status = 'BLOCKED') : (d.status = 'ACTIVE');

    this._subs.add(
      this._deviceService.updateDevice(d).subscribe(
        () => {
          this._onReqSuccess('Device status changed successfully.');
        },
        (e) => {
          if (e.error)
            e.error.message
              ? this._onReqError(e.error.message)
              : this._onReqError(
                  'Something went wrong. Could not change device status. Try again.'
                );
          else
            this._onReqError(
              'Something went wrong. Could not change device status. Try again.'
            );
        }
      )
    );
  }

  deleteDevice(): void {
    this.processing = true;
    this._subs.add(
      this._deviceService.deleteDevice(this.device.id).subscribe(
        () => {
          this._onReqSuccess('The device has been deleted successfully.');
        },
        (e) => {
          this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  closeFsDialog(): void {
    this.fsDialog = false;
    this.editingDevice = false;
    this.deletingDevice = false;
  }

  private _onReqSuccess(message: string) {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this._router.navigate(['devices']);
  }

  private _onReqError(message: string) {
    this.processing = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
