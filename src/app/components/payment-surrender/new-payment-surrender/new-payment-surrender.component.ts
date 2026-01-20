import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NotificationService } from '../../../services/notification.service';
import { Payment } from '../../../services/payment';
import { RegistrationService } from '../../../services/registration-service';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { CashSurrenderService } from '../../../services/cash-surrender-service';

export interface PaymentSurrenderLine {
  id: string;
  currencyCode: string;
  amount: number;
  description: string;
  secondCurrencyCode?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

@Component({
  selector: 'app-new-payment-surrender',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './new-payment-surrender.component.html',
  styleUrls: ['./new-payment-surrender.component.scss']
})
export class NewPaymentSurrenderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sidebarOpen = false;
  surrenderForm!: FormGroup;
  surrenderLineForm!: FormGroup;
  showAddLineModal = false;
  isEditMode = false;
  showModal = false;
  loading=false;
  subgranteeNo: any;
  no: string;
  paymentApplicationLines: any;
  project_code_list: any;
  currency_code_list: any;
  area_of_focus_items: any;
  isConfirmed = false;
  category_list: any;
  cash_list:any
  email: any;
  user: AuthUser | null = null;
  document_list: any;
  doc_list:any
  selectedFile: File | null = null;
  uploading = false;
  documentCodeControl = new FormControl('', Validators.required);
  fileControl = new FormControl<File | null>(null, Validators.required);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: Payment,
    private notificationService: NotificationService,
    private registrationService: RegistrationService,
    private authService:AuthService,
    private cashSurrenderService: CashSurrenderService,
  ) {
    this.initializeForms();
    const encodedNo = this.route.snapshot.paramMap.get('id');
      if (encodedNo) {
        this.no = atob(encodedNo);
      }
    this.surrenderForm.patchValue({
      no: this.no
    });
    this.user = this.authService.getLoggedInUser();
    this.subgranteeNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
  }

  ngOnInit(): void {
    this.cashSurrenderService.getSingleCashSurrender(this.no).subscribe(data=>{
        // this.surrenderForm.patchValue(data);
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
    this.cashSurrenderService.getPostedCashRequests(this.email).subscribe(data=>{
        this.cash_list=data;
      });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });

    this.getUploadedPortalAttachments()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.surrenderForm = this.fb.group({
      no: [{ value: '', disabled: true }],
      emailAddress: [''],
      subgranteeNo: [''],
      documentDate: [''],
      paymentRequest: [''],
      currencyCode: [{ value: '', disabled: true }],
      disbursedAmount: [{ value: '', disabled: true }],
      disbursedAmountLCY:[{value: '', disabled: true}],
      surrenderedAmount: [{ value: '', disabled: true }],
      surrenderedAmountLCY:[{ value: '', disabled: true }],
      startDate: [''],
      endDate: [''],
      surrenderDate: [''],
      paymentRequestNo:[''],
      description:['']
    });

    this.surrenderLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        amountAdvanced: [{ value: '', disabled: true }],
        actualSpent: [''],
        currencyCode: [{ value: '', disabled: true }],
        category: [{ value: '', disabled: true }],
        description:['']
    });
  }

  openAddLineModal() {
    this.showAddLineModal = true;
    this.isEditMode = false;
    this.surrenderLineForm.reset();
  }

  submitLine() {
    this.loading=true
      if( this.surrenderLineForm.valid){
      let formValues = this.surrenderLineForm.value;
      formValues.no = this.no;
      this.cashSurrenderService.createUpdateCashSurrenderLine(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
      this.closeCustomModal();
        this.getAllCashSurrenderLines();
        this.isEditMode = true;
          this.loading=false;
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
        this.surrenderForm.markAllAsTouched();
      }
  }

  cashRequest(){
    this.validateCashSurrenderLines()
    const selected = this.surrenderForm.get('paymentRequestNo')?.value;
    if (!selected) return;
    this.cashSurrenderService.getCashRequestDetailsByNo(selected).subscribe(data => {
      const patchedData = { ...data };
      delete patchedData.no;
      this.surrenderForm.patchValue(patchedData);
    });
    this.cashSurrenderService.getCashSurrenderDocuments().subscribe(data=>{
     this.doc_list=data;
    });
  }

  getAllCashSurrenderLines(){
     this.cashSurrenderService.getAllCashSurrenderLines(this.no).subscribe(data=>{
      this.paymentApplicationLines=data
       this.calculateTotals()
    });
  }

  validateCashSurrenderLines(){
     const disbursementNo = this.surrenderForm.get('paymentRequestNo')?.value;
     this.cashSurrenderService.validateCashSurrenderLines(this.no, disbursementNo).subscribe(data=>{
      this.getAllCashSurrenderLines()
      this.calculateTotals()
    });
  }

  onCheckboxChange(event: Event) {
      const input = event.target as HTMLInputElement;
      this.isConfirmed = input.checked;
    }

  onSubmitPaymentHeader() {
      this.loading=true
      if( this.surrenderForm.valid){
      let formValues = this.surrenderForm.value;
      formValues.subgranteeNo = this.subgranteeNo;
      formValues.no = this.no;
      this.cashSurrenderService.createUpdateCashSurrender(formValues).subscribe({next:(res) => {
      this.router.navigate(['/payment-surrender']);
      this.notificationService.success('', res['responseDescription']);
      this.loading = false;
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
        this.surrenderForm.markAllAsTouched();
      }
  }

  onCancel() {
    this.router.navigate(['/payment-surrender']);
  }

 editRequest(row: any) {
      this.showModal = true;
      this.isEditMode = true;
        this.surrenderLineForm.patchValue({
    ...row,
    action: 'update'
    });
    }

  deleteRequest(lineNo: string) {
     this.cashSurrenderService.deleteCashSurrenderLine(lineNo, this.no,).subscribe(res=>{
      this.notificationService.success('', res['responseDescription']);
      this.getAllCashSurrenderLines()
    });
   }

   openCustomModal() {
      this.showModal = true;
    }

    closeCustomModal() {
      this.showModal = false;
    }

    saveModal() {
      console.log(this.surrenderForm.value);
      this.closeCustomModal();
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
    for (const row of this.paymentApplicationLines ?? []) {
      totalAmount += Number(row.actualSpent) || 0;
    }
    this.surrenderForm.patchValue({
      surrenderedAmount: totalAmount,
    });
}
}
