import { CashRequestService } from './../../../services/cash-request-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  email: any;
  company: any;
  user: AuthUser | null = null;
  isConfirmed = false;
  document_list: any;
  doc_list:any
  selectedFile: File | null = null;
  uploading = false;
  documentCodeControl = new FormControl('', Validators.required);
  fileControl = new FormControl<File | null>(null, Validators.required);
  totalAmount = 0;
  totalAmountLCY = 0;

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
      this.company=this.user?.companyKey;
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
    this.cashRequestService.getSingleCashRequest(this.no, this.company).subscribe(data=>{
      // this.paymentRequestForm.patchValue(data);
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
    this.cashRequestService.getApprovedFundingRequests(this.email, this.company).subscribe(data=>{
        this.activity_code_list=data;
      });
    this.cashRequestService.getCashRequestDocuments().subscribe(data=>{
        this.doc_list=data;
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
      const { no, ...formDataWithoutNo } = data;
      this.paymentRequestForm.patchValue(formDataWithoutNo);
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
        description: ['',Validators.required],
        projectCode: [''],
        declarationDone: [''],
        declarationDate: [''],
        indirectCostPercentage: [{ value: '', disabled: true }],
        indirectCost: [{ value: '', disabled: true }],
        indirectCostLCY: [{ value: '', disabled: true }],
        responseDescription: [''],
        status: [''],
        company:[''],
    });


    this.paymentRequestLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        category: [''],
        amount: [''],
        amountLCY: [''],
        projectCode:[''],
        description: [''],
        company:[''],
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
     this.cashRequestService.deleteLine(lineNo, this.no, this.company).subscribe(res=>{
      this.notificationService.success('', res['responseDescription']);
      this.getAllCashRequestLines();
    });
   }

  submitLine() {
    this.loading=true
      if( this.paymentRequestLineForm.valid){
      const projectCodeControl = this.paymentRequestForm.get('projectCode');
      projectCodeControl?.enable({ emitEvent: false });
      let formValues = this.paymentRequestLineForm.value;
       formValues.projectCode=this.paymentRequestForm.get('projectCode')?.value;
      formValues.documentNo = this.no;
      formValues.company = this.company;
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
     this.cashRequestService.getAllCashRequestLines(this.no, this.company).subscribe(data=>{
      this.paymentApplicationLines=data
      this.calculateTotals();
    });
  }

  onSubmitPaymentHeader() {
      this.loading=true
      if( this.paymentRequestForm.valid){
       this.paymentRequestForm.enable();
      let formValues = this.paymentRequestForm.value;
      formValues.subgranteeNo = this.subgranteeNo;
      formValues.no = this.no;
       formValues.company = this.company;
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
    const patchedData = { ...data };
    delete patchedData.no;
    this.paymentRequestForm.patchValue(patchedData);
    this.calculateTotals()
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
        this.doc_list=data
      })
    }
  patchDocumentCode(event: Event) {
      const select = event.target as HTMLSelectElement | null;
      if (!select) return;
      const value = select.value;
      this.documentCodeControl.setValue(value);
    }
calculateTotals(): void {
  let totalAmount = 0;
  let totalAmountLCY = 0;
  for (const row of this.paymentApplicationLines ?? []) {
    totalAmount += Number(row.amount) || 0;
    totalAmountLCY += Number(row.amountLCY) || 0;
  }
  this.totalAmount = totalAmount;
  this.totalAmountLCY = totalAmountLCY;
  this.paymentRequestForm.patchValue({
    requestedAmount: this.totalAmount,
    requestedAmountLCY: this.totalAmountLCY
  });
}

}
