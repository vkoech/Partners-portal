import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { CashRequestService } from '../../../services/cash-request-service';
import { NotificationService } from '../../../services/notification.service';
import { Payment } from '../../../services/payment';
import { RegistrationService } from '../../../services/registration-service';

@Component({
  selector: 'app-view-cash-request',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './view-cash-request.html',
  styleUrl: './view-cash-request.scss'
})
export class ViewCashRequest {
   paymentRequestForm!: FormGroup;
   no: string;
   email: any;
   user: AuthUser | null = null;
   subgranteeNo: any;
   sidebarOpen: any;
   paymentApplicationLines: any;
   approvedApplicationNo: string;
   uploaded_document_list: any



 constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: Payment,
    private notificationService: NotificationService,
    private registrationService: RegistrationService,
    private cashRequestService : CashRequestService,
     private authService: AuthService,

  ) {

    this.user = this.authService.getLoggedInUser();
    this.subgranteeNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
    const encodedNo = this.route.snapshot.paramMap.get('id');
    const encodedNo2 = this.route.snapshot.paramMap.get('id2');
      if (encodedNo) {
        this.no = atob(encodedNo);
      }
      if (encodedNo2) {
        this.approvedApplicationNo = atob(encodedNo2);
      }
  }


  ngOnInit(): void {
      this.registrationService.getUploadedPortalAttachments(this.no).subscribe(data=>{
          this.uploaded_document_list=data
        })
       this.paymentRequestForm = this.fb.group({
        no: [{ value: '', disabled: true }],
        emailAddress: [''],
        subgranteeNo: [''],
        approvedApplicationNo: [''],
        subAwardStartDate:[{ value: '', disabled: true }],
        subAwardEndDate:[{ value: '', disabled: true }],
        reportingCycle:[{ value: '', disabled: true }],
        areaOfFocus: [{ value: '', disabled: true }],
        documentDate: [''],
        requestedDate: [''],
        currencyCode: [{ value: '', disabled: true }],
        requestedAmount: [{ value: '', disabled: true }],
        requestedAmountLCY: [{ value: '', disabled: true }],
        description: [''],
        projectCode: [{ value: '', disabled: true }],
        declarationDone: [''],
        declarationDate: [''],
        indirectCostPercentage: [{ value: '', disabled: true }],
        indirectCost: [{ value: '', disabled: true }],
        indirectCostLCY: [{ value: '', disabled: true }],
        responseDescription: [''],
        status: [{ value: '', disabled: true }]
    });
    this.cashRequestService.getSingleCashRequest(this.no).subscribe(data=>{
      this.paymentRequestForm.patchValue(data);
    });
    this.cashRequestService.getAllCashRequestLines(this.no).subscribe(data=>{
      this.paymentApplicationLines=data
    });
  }

 onCancel() {
    this.router.navigate(['/cash-request']);
  }

  }
