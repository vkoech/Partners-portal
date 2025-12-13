import { CashRequestService } from './../../../services/cash-request-service';
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
import { AuthService, AuthUser } from '../../../services/auth.service';

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
  subgranteeNo: any;
  no: string;
  approvedApplicationNo: string;
  paymentApplicationLines: any;
  project_code_list: any;
  currency_code_list: any;
  area_of_focus_items: any;
  activity_code_list:any;
  approvedFundingNo:any;
  category_list:any
  email: any
  user: AuthUser | null = null;
  isConfirmed = false;


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
    this.initializeForms();
    const encodedNo = this.route.snapshot.paramMap.get('id');
    const encodedNo2 = this.route.snapshot.paramMap.get('id2');

      if (encodedNo) {
        this.no = atob(encodedNo);
      }
        if (encodedNo2) {
        this.approvedApplicationNo = atob(encodedNo2);
      }
        this.paymentRequestForm.patchValue({
            no: this.no
          });
  }

  ngOnInit(): void {
    this.cashRequestService.getSingleCashRequest(this.no).subscribe(data=>{
      // this.paymentRequestForm.patchValue(data);
    });

    this.paymentService.getProjectCodes().subscribe(data=>{
        this.project_code_list=data;
      });
    this.paymentService.getcurrencyCodes().subscribe(data=>{
        this.currency_code_list=data;
      });
    this.paymentService.getCategories().subscribe(data=>{
        this.category_list=data;
      });
    this.cashRequestService.getApprovedFundingRequests(this.email).subscribe(data=>{
        this.activity_code_list=data;
      });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
    this.getAllCashRequestLines();
    if (
        this.approvedApplicationNo &&
        this.approvedApplicationNo !== ''
      )
    this.paymentService.getFundingApplicationDetailsByNo(this.approvedApplicationNo).subscribe(data => {
    this.paymentRequestForm.patchValue(data);
    });
  }

  ngOnDestroy() {
  }

  private initializeForms() {
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
        status: ['']
    });



    this.paymentRequestLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        category: [''],
        amount: [''],
        amountLCY: [''],
        projectCode:[''],
        description: ['']
    });
    this.getAllCashRequestLines()
  }

  openAddLineModal() {
    this.showAddLineModal = true;
    this.isEditMode = false;
    this.paymentRequestLineForm.reset();
  }

  editRequest(row: any) {
      this.showModal = true;
      this.isEditMode = true;
        this.paymentRequestLineForm.patchValue({
    ...row,
    action: 'update'
     });
    }
   deleteRequest(lineNo: string) {
     this.cashRequestService.deleteLine(lineNo, this.no,).subscribe(res=>{
      this.notificationService.success('', res['responseDescription']);
      this.getAllCashRequestLines();
    });
   }

  submitLine() {
    this.loading=true
      if( this.paymentRequestLineForm.valid){
      let formValues = this.paymentRequestLineForm.value;
       formValues.projectCode=this.paymentRequestForm.get('projectCode')?.value;
      formValues.documentNo = this.no;
      this.cashRequestService.createUpdateCashRequestLine(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
      this.getAllCashRequestLines();
      this.closeCustomModal();
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

  getAllCashRequestLines(){
     this.cashRequestService.getAllCashRequestLines(this.no).subscribe(data=>{
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

  onSubmitPaymentHeader() {
      this.loading=true
      if( this.paymentRequestForm.valid){
      let formValues = this.paymentRequestForm.value;
      formValues.subgranteeNo = this.subgranteeNo;
      formValues.no = this.no;
      this.cashRequestService.createUpdateCashRequest(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
      this.router.navigate(['/cash-request']);
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
    this.router.navigate(['/cash-request']);
  }

  openCustomModal() {
  this.showModal = true;
}

closeCustomModal() {
  this.showModal = false;
  this.paymentRequestLineForm.reset();
}

onCheckboxChange(event: Event) {
      const input = event.target as HTMLInputElement;
      this.isConfirmed = input.checked;
    }

getApplicationNo(){
 const selected = this.paymentRequestForm.get('approvedApplicationNo')?.value;
  if (!selected) return;
  this.paymentService.getFundingApplicationDetailsByNo(selected).subscribe(data => {
    this.paymentRequestForm.patchValue(data);
  });
}

}
