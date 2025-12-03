import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

export interface PaymentRequestLine {
  id: string;
  currencyCode: string;
  amount: number;
  description: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

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
  currentEditingLine: PaymentRequestLine | null = null;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Initialize component
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
      subAwardTitle: ['']
    });

    this.paymentRequestLineForm = this.fb.group({
        lineNo: [''],
        documentNo: [''],
        projectCode: [''],
        projectName: [''],
        activityCode: [''],
        activityName: [''],
        applicationDate: [''],
        appliedAmount: [''],
        appliedAmountLCY: [''],
        obligatedAmount: [''],
        obligatedAmountLCY: [''],
        description: ['']
    });
  }

  openAddLineModal() {
    this.showAddLineModal = true;
    this.isEditMode = false;
    this.paymentRequestLineForm.reset();
  }

  openEditLineModal(line: PaymentRequestLine) {
    this.showAddLineModal = true;
    this.isEditMode = true;
    this.currentEditingLine = line;
    this.paymentRequestLineForm.patchValue(line);
  }

  closeAddLineModal() {
    this.showAddLineModal = false;
    this.isEditMode = false;
    this.currentEditingLine = null;
    this.paymentRequestLineForm.reset();
  }

  submitLine() {
    
  }

  deleteLine(lineId: string) {
    
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


  viewDocument(document: UploadedDocument) {
    console.log('Viewing document:', document.name);
  }

  deleteDocument(documentId: string) {
  }

  onSubmit() {

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