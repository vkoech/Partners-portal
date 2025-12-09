import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Payment } from '../../../services/payment';
import { NotificationService } from '../../../services/notification.service';
import { RegistrationService } from '../../../services/registration-service';
import { AuthService, AuthUser } from '../../../services/auth.service';



@Component({
  selector: 'app-new-payment-request',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './new-payment-request.component.html',
  styleUrls: ['./new-payment-request.component.scss']
})
export class NewPaymentRequestComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sidebarOpen = false;
  paymentRequestForm!: FormGroup;
  paymentRequestLineForm!: FormGroup;
  showAddLineModal = false;
  isEditMode = false;
  showModal = false;
  loading=false;
  subgranteeNo: any;
  no: string;
  email: any;
  user: AuthUser | null = null;
  paymentApplicationLines: any;
  project_code_list: any;
  currency_code_list: any;
  area_of_focus_items: any;
  reporting_cycle_list:any;
  category_list:any
  isConfirmed = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: Payment,
    private notificationService: NotificationService,
    private registrationService: RegistrationService,
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
    this.paymentService.getSingleFundingApplication(this.no).subscribe(data=>{
        this.paymentRequestForm.patchValue(data);
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
      this.paymentService.getReportingCycles().subscribe(data=>{
        this.reporting_cycle_list=data;
      });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
    this.getFundsApplicationLines()
    this.initializeForms()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.paymentRequestForm = this.fb.group({
      no: [''],
      emailAddress: [''],
      subgranteeNo: [''],
      // documentDate: [''],
      applicationDate: [''],
      subAwardStartDate: [''],
      subAwardEndDate: [''],
      projectCode: [''],
      // purpose: [''],
      currencyCode: [''],
      reportingCycle: [''],
      budgetAmount: [''],
      budgetAmountLCY: [''],
      obligatedAmount: [''],
      obligatedAmountLCY: [''],
      subAwardTitle: [''],
      areaOfFocus:[''],
      description: [''],
      declarationDone:[''],
      declarationDate:[''],
      status:[''],
      responseDescription:[''],
      responseCode:true
    });

    this.paymentRequestLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        category: [''],
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
      formValues.documentNo = this.no;
      formValues.declarationDone=this.isConfirmed;
      this.paymentService.createUpdateFundingApplicationLine(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
        this.getFundsApplicationLines();
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

  deleteRequest(lineId: string) {

   }
   editRequest(lineId: string) {

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

  onCheckboxChange(event: Event) {
      const input = event.target as HTMLInputElement;
      this.isConfirmed = input.checked;
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
    this.router.navigate(['/funding-request']);
  }

  openCustomModal() {
  this.showModal = true;
}

closeCustomModal() {
  this.showModal = false;
}

}
