import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from 'src/app/shared/device';
import { SubSink } from 'subsink';
import { DeviceService } from '../device.service';

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

  error = null;
  success = null;
  processing = true;
  viewingDevices = true;
  registeringDevice = false;
  editingDevice = false;
  deletingDevice = false;
  fsDialog = false;

  constructor(private _deviceService: DeviceService) {}

  ngOnInit(): void {
    this._subs.add(
      this._deviceService.getDevices().subscribe(
        (res) => {
          this.devices = res.devices;
          this.hasDevices = !res.empty;
          this.totalDevices = res.total;
          this.processing = false;
        },
        (e) => {
          this.processing = false;
          this.error = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.error = null;
          }, 5000);
        }
      )
    );

    this.editDeviceForm = new FormGroup({
      imei: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
    });

    this.registerDeviceForm = new FormGroup({
      imei: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
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
        (res) => {
          console.log(res);
          this.processing = false;
        },
        (e) => {
          this.processing = false;
          this.error = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.error = null;
          }, 5000);
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
      agent: 'Memphis',
    };

    this._subs.add(
      this._deviceService.updateDevice(d).subscribe(
        (res) => {
          console.log(res);
          this.processing = false;
        },
        (e) => {
          this.processing = false;
          this.error = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.error = null;
          }, 5000);
        }
      )
    );
  }

  deleteDevice(): void {
    this.processing = true;
    this._subs.add(
      this._deviceService.deleteDevice(this.device.id).subscribe(
        (res) => {
          console.log(res);
          this.processing = false;
        },
        (e) => {
          this.processing = false;
          this.error = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.error = null;
          }, 5000);
        }
      )
    );
  }

  closeFsDialog(): void {
    this.fsDialog = false;
    this.editingDevice = false;
    this.deletingDevice = false;
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
