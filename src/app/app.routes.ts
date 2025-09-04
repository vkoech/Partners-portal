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

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'signup', component: Signup },
  { path: 'approved-funding', component: ApprovedFundingComponent },
  { path: 'payment-request', component: PaymentRequestComponent },
  { path: 'new-payment-request', component: NewPaymentRequestComponent },
  { path: 'new-payment-request/:id', component: NewPaymentRequestComponent },
  { path: 'payment-surrender', component: PaymentSurrenderComponent },
  { path: 'new-payment-surrender', component: NewPaymentSurrenderComponent },
  { path: 'new-payment-surrender/:id', component: NewPaymentSurrenderComponent },
  { path: 'reimbursements', component: ReimbursementsComponent },
  { path: 'new-reimbursement', component: NewReimbursementComponent },
  { path: 'new-reimbursement/:id', component: NewReimbursementComponent },
];
