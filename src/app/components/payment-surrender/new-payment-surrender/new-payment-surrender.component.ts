import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NotificationService } from '../../../services/notification.service';
import { Payment } from '../../../services/payment';
import { RegistrationService } from '../../../services/registration-service';

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
  subgranteeNo: string;
  no: string;
  paymentApplicationLines: any;
  project_code_list: any;
  currency_code_list: any;
  area_of_focus_items: any;
  isConfirmed = false;


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
        this.surrenderForm.patchValue(data);
      });
    this.paymentService.getProjectCodes().subscribe(data=>{
        this.project_code_list=data;
      });
    this.paymentService.getcurrencyCodes().subscribe(data=>{
        this.currency_code_list=data;
      });
    this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
    this.getFundsApplicationLines()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.surrenderForm = this.fb.group({
      no: [''],
      emailAddress: [''],
      subgranteeNo: [''],
      documentDate: [''],
      paymentRequest: [''],
      currencyCode: [''],
      disbursedAmount: [''],
      surrenderedAmount: [''],
      startDate: [''],
      endDate: [''],
      surrenderDate: [''],
    });

    this.surrenderLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        amountReceived: [''],
        amountSpent: [''],
        balance: [''],
        currencyCode: [''],
        category: [''],
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
      formValues.subgranteeNo = this.subgranteeNo;
      formValues.no = this.no;
      this.paymentService.createUpdateFundingApplicationLine(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
        this.getFundsApplicationLines();
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
      this.paymentService.createUpdateFundingApplication(formValues).subscribe({next:(res) => {
      this.notificationService.success('', res['responseDescription']);
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
    this.router.navigate(['/payment-request']);
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
}
