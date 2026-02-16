import { CashRequest } from './components/cash-request/cash-request';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PaymentRequestComponent } from './components/payment-request/payment-request.component';
import { NewPaymentRequestComponent } from './components/payment-request/new-payment-request/new-payment-request.component';
import { PaymentSurrenderComponent } from './components/payment-surrender/payment-surrender.component';
import { NewPaymentSurrenderComponent } from './components/payment-surrender/new-payment-surrender/new-payment-surrender.component';
import { ApprovedFundingComponent } from './components/approved-funding/approved-funding.component';
import { ReimbursementsComponent } from './components/reimbursements/reimbursements.component';
import { NewReimbursementComponent } from './components/reimbursements/new-reimbursement/new-reimbursement.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { Signup } from './components/signup/signup';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { Otp } from './components/otp/otp';
import { NewCashRequest } from './components/cash-request/new-cash-request/new-cash-request';
import { ViewPaymentRequest } from './components/payment-request/view-payment-request/view-payment-request';
import { ViewCashRequest } from './components/cash-request/view-cash-request/view-cash-request';
import { ViewApprovedFunding } from './components/approved-funding/view-approved-funding/view-approved-funding';
import { ViewPaymentSurrender } from './components/payment-surrender/view-payment-surrender/view-payment-surrender';
import { Profile } from './components/registration/profile/profile';
import { Report } from './components/report/report';
import { GenerateOtp } from './components/generate-otp/generate-otp';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: Profile },
  { path: 'signup', component: Signup },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'otp-verification', component: Otp },
   { path: 'generate-otp', component: GenerateOtp },
  { path: 'reset-password', component: ResetPassword },
  //renamed to funding
  { path: 'approved-funding', component: ApprovedFundingComponent },
  { path: 'funding-request', component: PaymentRequestComponent },
  { path: 'funding-request', component: NewPaymentRequestComponent },
  { path: 'funding-request/:id', component: NewPaymentRequestComponent },
  { path: 'view-funding-request/:id', component:  ViewPaymentRequest},
  { path: 'view-approved-funds-application/:id', component:  ViewApprovedFunding},
  { path: 'cash-request', component: CashRequest },
  { path: 'new-cash-request/:id/:id2', component: NewCashRequest },
  { path: 'new-cash-request/:id', component: NewCashRequest },
  { path: 'view-cash-request/:id', component: ViewCashRequest},
  { path: 'payment-surrender', component: PaymentSurrenderComponent },
  { path: 'new-payment-surrender', component: NewPaymentSurrenderComponent },
  { path: 'new-payment-surrender/:id', component: NewPaymentSurrenderComponent },
   { path: 'view-payment-surrender/:id', component:ViewPaymentSurrender },
  { path: 'reimbursements', component: ReimbursementsComponent },
  { path: 'new-reimbursement', component: NewReimbursementComponent },
  { path: 'new-reimbursement/:id', component: NewReimbursementComponent },
   { path: 'report', component: Report },
];
