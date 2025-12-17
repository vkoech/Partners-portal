import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  document_list: any;
  funding_doc_list:any
  selectedFile: File | null = null;
  uploading = false;
  uploaded_document_list:any
  documentCodeControl = new FormControl('', Validators.required);
  fileControl = new FormControl<File | null>(null, Validators.required);


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
      if (data.subAwardEndDate ) {
          const parts = data.subAwardEndDate.split('/');
          data.subAwardEndDate = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
        }
       if (data.subAwardStartDate ) {
          const parts = data.subAwardStartDate.split('/');
          data.subAwardStartDate = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
        }
        this.paymentRequestForm.patchValue(data);
      });
    this.paymentService.getProjectCodes(this.subgranteeNo).subscribe(data=>{
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
     this.paymentService.getFundingApplicationDocuments().subscribe(data=>{
        this.funding_doc_list=data;
      });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
    this.getFundsApplicationLines()
    this.initializeForms()
    this.getUploadedPortalAttachments();
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
      applicationDate: [''],
      subAwardStartDate: [{ value: '', disabled: true }],
      subAwardEndDate: [{ value: '', disabled: true }],
      projectCode: [''],
      projectStartDate: [{ value: '', disabled: true }],
      projectEndDate: [{ value: '', disabled: true }],
      currencyCode: [''],
      reportingCycle: [''],
      budgetAmount: [''],
      budgetAmountLCY: [''],
      subAwardTitle: [{ value: '', disabled: true }],
      areaOfFocus:[''],
      description: [{ value: '', disabled: true }],
      declarationDone:[''],
      declarationDate:[''],
      status:[''],
      responseDescription:[''],
      responseCode:true
    },
    {
    validators: this.dateRangeValidator
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
 dateRangeValidator(form: FormGroup) {
    const start = form.get('subAwardStartDate')?.value;
    const end = form.get('subAwardEndDate')?.value;
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate < startDate ? { dateRangeInvalid: true } : null;
  }
  submitLine() {
    this.loading=true
      if( this.paymentRequestLineForm.valid){
      let formValues = this.paymentRequestLineForm.value;
      formValues.documentNo = this.no;
      this.paymentService.createUpdateFundingApplicationLine(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
        this.getFundsApplicationLines();
        this.closeCustomModal();
          this.loading=false;
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

  deleteRequest(lineNo: string) {
     this.paymentService.deleteFundingApplicationLine(lineNo, this.no,).subscribe(res=>{
      this.notificationService.success('', res['responseDescription']);
      this.getFundsApplicationLines();
    });
   }
  openCustomModal() {
    this.showModal = true;
    this.isEditMode = false;
  }
  editRequest(row: any) {
      this.showModal = true;
      this.isEditMode = true;
        this.paymentRequestLineForm.patchValue({
    ...row,
    action: 'update'
  });
    }

  getFundsApplicationLines(){
     this.paymentService.getAllFundingApplicationLines(this.no).subscribe(data=>{
      this.paymentApplicationLines=data
    });
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
      this.router.navigate(['/funding-request']);
        this.isEditMode = true;
        this.loading = false;
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

getProjectCode() {
  const selected = this.paymentRequestForm.get('projectCode')?.value;
  if (!selected) return;
  this.paymentService.getProjectDetails(selected).subscribe(data => {
    this.paymentRequestForm.patchValue(data);
  });

}


onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      input.value = '';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('File size must not exceed 5MB');
      input.value = '';
      return;
    }
    this.selectedFile = file;
    this.fileControl.setValue(file);
    this.fileControl.updateValueAndValidity();
  }

uploadDocument() {
    if (this.documentCodeControl.invalid || this.fileControl.invalid) {
      alert('Please select a document code and PDF file');
      return;
    }
    const formData = new FormData();
    formData.append('documentCode', this.documentCodeControl.value!);
    formData.append('file', this.fileControl.value!);
    formData.append('documentNo', this.no);
    this.uploading = true;
      this.paymentService.uploadDocument(formData).subscribe({
      next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getUploadedPortalAttachments();
        this.selectedFile = null;
        this.uploading = false;
      },
      error: err => {
        console.error(err);
        alert('Upload failed');
      }
    });
  }
 getUploadedPortalAttachments(){
    this.registrationService.getUploadedPortalAttachments(this.no).subscribe(data=>{
      this.uploaded_document_list=data
    })
   }
 patchDocumentCode(event: Event) {
      const select = event.target as HTMLSelectElement | null;
      if (!select) return;
      const value = select.value;
      this.documentCodeControl.setValue(value);
    }

closeCustomModal() {
  this.showModal = false;
  this.paymentRequestLineForm.reset();
}

}
