import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './routes/home/home.component';
import { OperatorsComponent } from './routes/dashboard/reps/operators/operators.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { DevicesComponent } from './routes/dashboard/reps/devices/devices.component';
import { CashInComponent } from './routes/transactions/cash-in/cash-in.component';
import { CashOutComponent } from './routes/transactions/cash-out/cash-out.component';
import { SettingsComponent } from './routes/account/settings/settings.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ErrorModal } from './shared/modal/error';
import { ProcessingModal } from './shared/modal/processing';
import { WarningModal } from './shared/modal/warning';
import { SuccessModal } from './shared/modal/success';
import { OperatorTransactionsComponent } from './routes/transactions/operator-transactions/operator-transactions.component';
import { DatePipe } from '@angular/common';
import { DeviceTransactionsComponent } from './routes/transactions/device-transactions/device-transactions.component';
import { AgentToAgentComponent } from './routes/transactions/agent-to-agent/agent-to-agent.component';
import { WalletToBankComponent } from './routes/transactions/wallet-to-bank/wallet-to-bank.component';
import { TransactionsComponent } from './routes/transactions/transactions.component';
import { OverviewComponent } from './routes/dashboard/overview/overview.component';
import { RepsComponent } from './routes/dashboard/reps/reps.component';
import { AccountComponent } from './routes/account/account.component';
import { ReportsComponent } from './routes/account/reports/reports.component';
import { TransactionHistoryComponent } from './routes/account/reports/transaction-history/transaction-history.component';

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
    OperatorTransactionsComponent,
    DeviceTransactionsComponent,
    AgentToAgentComponent,
    WalletToBankComponent,
    TransactionsComponent,
    OverviewComponent,
    RepsComponent,
    AccountComponent,
    ReportsComponent,
    TransactionHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
