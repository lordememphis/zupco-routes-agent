import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Device } from 'src/app/shared/models/device.model';
import { SubSink } from 'subsink';
import { DeviceService } from './device.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
})
export class DevicesComponent implements OnInit, OnDestroy {
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
  private subs = new SubSink();

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    titleService: Title
  ) {
    this.subs.add(
      this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
    titleService.setTitle('Dashboard — Account Devices');
  }

  ngOnInit(): void {
    this.viewingDevices = true;
    this.registeringDevice = false;
    this.editingDevice = false;
    this.deletingDevice = false;
    this.fsDialog = false;

    this.subs.add(
      this.deviceService.getDevices().subscribe(
        (res) => {
          this.devices = res.devices;
          this.hasDevices = !res.empty;
          this.totalDevices = res.total;
          this.processing = false;
        },
        (e) => {
          if (!e.error) {
            this.onReqError(
              'The server cannot be reached at the moment. Check your internet connection and try again later'
            );
          } else if (e.error.message) {
            this.onReqError(e.error.message);
          } else {
            this.onReqError('Something went wrong. Try again.');
          }
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

    this.subs.add(
      this.deviceService.registerDevice(device).subscribe(
        () => {
          this.onReqSuccess('The device has been registered successfully.');
        },
        (e) => {
          if (!e.error) {
            this.onReqError(
              'The server cannot be reached at the moment. Check your internet connection and try again later'
            );
          } else if (e.error.message) {
            this.onReqError(e.error.message);
          } else {
            this.onReqError('Something went wrong. Try again.');
          }
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

    this.subs.add(
      this.deviceService.updateDevice(d).subscribe(
        () => {
          this.onReqSuccess('The device has been updated successfully.');
        },
        (e) => {
          this.onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  changeDeviceStatus(device: Device): void {
    this.processing = true;
    const { ...d } = device;

    device.status === 'ACTIVE' ? (d.status = 'BLOCKED') : (d.status = 'ACTIVE');

    this.subs.add(
      this.deviceService.updateDevice(d).subscribe(
        () => {
          this.onReqSuccess('Device status changed successfully.');
        },
        (e) => {
          if (e.error)
            e.error.message
              ? this.onReqError(e.error.message)
              : this.onReqError(
                  'Something went wrong. Could not change device status. Try again.'
                );
          else
            this.onReqError(
              'Something went wrong. Could not change device status. Try again.'
            );
        }
      )
    );
  }

  deleteDevice(): void {
    this.processing = true;
    this.subs.add(
      this.deviceService.deleteDevice(this.device.id).subscribe(
        () => {
          this.onReqSuccess('The device has been deleted successfully.');
        },
        (e) => {
          this.onReqError('Something went wrong. Try again.');
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
    this.subs.unsubscribe();
  }

  private onReqSuccess(message: string): void {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this.router.navigate(['dashboard', 'reps', 'devices']);
  }

  private onReqError(message: string): void {
    this.processing = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }
}
