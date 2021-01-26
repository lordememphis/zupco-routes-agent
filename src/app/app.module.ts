import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './routes/home/home.component';
import { OperatorsComponent } from './routes/operators/operators.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { DevicesComponent } from './routes/devices/devices.component';
import { CashInComponent } from './routes/transactions/cash-in/cash-in.component';
import { CashOutComponent } from './routes/transactions/cash-out/cash-out.component';
import { SettingsComponent } from './routes/settings/settings.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ErrorModal } from './shared/modal/error';
import { ProcessingModal } from './shared/modal/processing';
import { WarningModal } from './shared/modal/warning';
import { SuccessModal } from './shared/modal/success';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    OperatorsComponent,
    DashboardComponent,
    DevicesComponent,
    CashInComponent,
    CashOutComponent,
    SettingsComponent,
    ResetPasswordComponent,
    ProcessingModal,
    ErrorModal,
    WarningModal,
    SuccessModal,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
