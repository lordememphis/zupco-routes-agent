import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Device } from 'src/app/shared/device';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  registerDeviceForm: FormGroup;
  editDeviceForm: FormGroup;

  devices: Device[] = [];
  device: Device;

  alert = null;
  viewingDevices = true;
  registeringDevice = false;
  editingDevice = false;
  deletingDevice = false;
  fsDialog = false;

  constructor(private _deviceService: DeviceService) {}

  ngOnInit(): void {
    this.devices = [
      {
        id: 1,
        imei: 'IMEI1',
        type: 'APP',
        status: 'ACTIVE',
        agent: 'Memphis',
      },
      {
        id: 2,
        imei: 'IMEI2',
        type: 'APP',
        status: 'INACTIVE',
        agent: 'Memphis',
      },
    ];

    this._deviceService.getDevices().subscribe(
      (data) => {
        console.log(data);
      },
      (e) => {
        this.alert = 'Something has gone wrong. Try again.';
        setTimeout(() => {
          this.alert = null;
        }, 5000);
      }
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
    const device: Device = {
      id: null,
      imei: this.registerDeviceForm.get('imei').value,
      type: this.registerDeviceForm.get('type').value,
      status: 'INACTIVE',
      agent: 'Memphis',
    };

    this._deviceService.registerDevice(device).subscribe(
      (res) => console.log(res),
      (e) => {
        this.alert = 'Something has gone wrong. Try again.';
        setTimeout(() => {
          this.alert = null;
        }, 5000);
      }
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
    const d: Device = {
      id: this.device.id,
      imei: this.registerDeviceForm.get('imei').value,
      type: this.registerDeviceForm.get('type').value,
      status: this.device.status,
      agent: 'Memphis',
    };

    this._deviceService
      .updateDevice(d)
      .pipe(
        map((data) => data),
        takeUntil(this._destroy$)
      )
      .subscribe(
        (data) => console.log(data),
        (e) => {
          this.alert = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.alert = null;
          }, 5000);
        }
      );
  }

  deleteDevice(): void {
    this._deviceService
      .deleteDevice(this.device.id)
      .pipe(
        map((data) => data),
        takeUntil(this._destroy$)
      )
      .subscribe(
        (res) => console.log(res),
        (e) => {
          this.alert = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.alert = null;
          }, 5000);
        }
      );
  }

  closeFsDialog(): void {
    this.fsDialog = false;
    this.editingDevice = false;
    this.deletingDevice = false;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
