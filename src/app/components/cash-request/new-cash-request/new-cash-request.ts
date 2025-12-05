import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Payment } from '../../../services/payment';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RegistrationService } from '../../../services/registration-service';

@Component({
  selector: 'app-new-cash-request',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './new-cash-request.html',
  styleUrl: './new-cash-request.scss'
})
export class NewCashRequest {
  sidebarOpen = false;
  paymentRequestForm!: FormGroup;
  paymentRequestLineForm!: FormGroup;
  showAddLineModal = false;
  isEditMode = false;
  showModal = false;
  loading=false;
  subgranteeNo: string;
  no: string;
  paymentApplicationLines: any;
  project_code_list: any;
  currency_code_list: any;
  area_of_focus_items: any;
  activity_code_list:any;
  approvedFundingNo:any


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: Payment,
    private notificationService: NotificationService,
    private registrationService: RegistrationService,
  ) {
    this.initializeForms();
    const encodedNo = this.route.snapshot.paramMap.get('id');
      if (encodedNo) {
        this.no = atob(encodedNo);
      }
  }

  ngOnInit(): void {
    this.paymentService.getSingleFundingApplication(this.no).subscribe(data=>{
      this.paymentRequestForm.patchValue(data);
    });

    this.paymentService.getProjectCodes().subscribe(data=>{
        this.project_code_list=data;
      });
    this.paymentService.getcurrencyCodes().subscribe(data=>{
        this.currency_code_list=data;
      });
    this.paymentService.getActivityCodes(this.approvedFundingNo).subscribe(data=>{
        this.activity_code_list=data;
      });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
    this.getFundsApplicationLines()
  }

  ngOnDestroy() {
  }

  private initializeForms() {
    this.paymentRequestForm = this.fb.group({
      no: [''],
      emailAddress: [''],
      subgranteeNo: [''],
      documentDate: [''],
      applicationDate: [''],
      subAwardStartDate: [''],
      subAwardEndDate: [''],
      projectCode: [''],
      purpose: [''],
      currencyCode: [''],
      reportingCycle: [''],
      budgetAmount: [''],
      budgetAmountLCY: [''],
      obligatedAmount: [''],
      obligatedAmountLCY: [''],
      subAwardTitle: [''],
      areaOfFocus:[''],
      description: [''],
      directCost:['']
    });

    this.paymentRequestLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        category: [''],
        amount: [''],
        appliedAmount: [''],
        appliedAmountLCY: [''],
        description: ['']
    });
  }

  openAddLineModal() {
    this.showAddLineModal = true;
    this.isEditMode = false;
    this.paymentRequestLineForm.reset();
  }

  submitLine() {
    this.loading=true
      if( this.paymentRequestLineForm.valid){
      let formValues = this.paymentRequestLineForm.value;
      formValues.subgranteeNo = this.subgranteeNo;
      formValues.no = this.no;
      this.paymentService.createUpdateFundingApplicationLine(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
        // this.getPartnersProfile();
        this.isEditMode = true;
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to update request.';
              this.notificationService.error('', message);
            }
        });
      }
      else {
        this.notificationService.warning('', 'Please fill all required fields correctly.');
        this.loading = false;
        this.paymentRequestForm.markAllAsTouched();
      }
  }

  deleteLine(lineId: string) {

  }

  getFundsApplicationLines(){
     this.paymentService.getAllFundingApplicationLines(this.no).subscribe(data=>{
      this.paymentApplicationLines=data
    });
  }

  triggerFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
    };
    fileInput.click();
  }

  deleteDocument(documentId: string) {
  }

  onSubmitPaymentHeader() {
      this.loading=true
      if( this.paymentRequestForm.valid){
      let formValues = this.paymentRequestForm.value;
      formValues.subgranteeNo = this.subgranteeNo;
      formValues.no = this.no;
      this.paymentService.createUpdateFundingApplication(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
        // this.getPartnersProfile();
        this.isEditMode = true;
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to update request.';
              this.notificationService.error('', message);
            }
        });
      }
      else {
        this.notificationService.warning('', 'Please fill all required fields correctly.');
        this.loading = false;
        this.paymentRequestForm.markAllAsTouched();
      }
  }

  onCancel() {
    this.router.navigate(['/payment-request']);
  }

  openCustomModal() {
  this.showModal = true;
}

closeCustomModal() {
  this.showModal = false;
}

saveModal() {
  console.log(this.paymentRequestForm.value);
  this.closeCustomModal();
}

}
