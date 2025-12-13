import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { Payment } from '../../../services/payment';
import { RegistrationService } from '../../../services/registration-service';

@Component({
  selector: 'app-view-payment-request',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './view-payment-request.html',
  styleUrl: './view-payment-request.scss'
})
export class ViewPaymentRequest {
sidebarOpen: any;
paymentRequestForm: FormGroup<any>;
paymentRequestLineForm: FormGroup<any>;
paymentApplicationLines:any;
no: string;
email: any;
user: AuthUser | null = null;
subgranteeNo: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: Payment,
    private authService:AuthService
  ) {
    this.user = this.authService.getLoggedInUser();
    this.subgranteeNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
     const encodedNo = this.route.snapshot.paramMap.get('id');
      if (encodedNo) {
        this.no = atob(encodedNo);
      }
  }
 ngOnInit(): void {
      this.paymentRequestForm = this.fb.group({
      no: [{ value: '', disabled: true }],
      emailAddress: [{ value: '', disabled: true }],
      subgranteeNo: [{ value: '', disabled: true }],
      applicationDate: [{ value: '', disabled: true }],
      subAwardStartDate: [{ value: '', disabled: true }],
      subAwardEndDate: [{ value: '', disabled: true }],
      projectCode: [{ value: '', disabled: true }],
      currencyCode: [{ value: '', disabled: true }],
      reportingCycle: [{ value: '', disabled: true }],
      budgetAmount: [{ value: '', disabled: true }],
      budgetAmountLCY: [{ value: '', disabled: true }],
      subAwardTitle: [{ value: '', disabled: true }],
      areaOfFocus:[{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      declarationDone:[{ value: '', disabled: true }],
      declarationDate:[{ value: '', disabled: true }],
      status:[{ value: '', disabled: true }],
    })

     this.paymentRequestLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        category: [''],
        appliedAmount: [''],
        appliedAmountLCY: [''],
        description: ['']
    });

    this.paymentService.getSingleFundingApplication(this.no).subscribe(data=>{
        this.paymentRequestForm.patchValue(data);
      });
     this.paymentService.getAllFundingApplicationLines(this.no).subscribe(data=>{
      this.paymentApplicationLines=data
      console.log(data)
    });

  }

  onCancel() {
}
}
