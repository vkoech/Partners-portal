import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  branchName: string;
  accountNo: string;
  amount: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  currentStep = 1;
  totalSteps = 6;

  personalInfoForm: FormGroup;
  areaOfFocusForm: FormGroup;
  contactPersonForm: FormGroup;
  docuumentForm: FormGroup;
  SummaryForm: FormGroup;
  experienceForm: FormGroup;

    projects = [
    { code: 'P001', name: 'Health Project' },
    { code: 'P002', name: 'Education Project' },
    { code: 'P003', name: 'Agriculture Project' }
  ];
   area = [
    { code: 'P001', name: 'Kenya ' },
    { code: 'P002', name: 'Uganda' },
    { code: 'P003', name: 'Tanzania' }
  ];




   areaOfFocus: any[]=[]
  uploadedDocuments: UploadedDocument[] = [

  ];

  bankAccounts: BankAccount[] = [

  ];

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Component initialization - no navigation here
    console.log('Registration component initialized');
  }

  private initializeForms() {
    this.personalInfoForm = this.fb.group({
      registrationNo: [''],
      organizationName: [''],
      physicalAddress: [''],
      phoneNumber: [''],
      tradingName: [''],
      registrationDate:[''],
      governingBody:[''],
      acronym: [''],
      ngoType: [''],
      emailAddress: [''],
      postalAddress: [''],
      website: [''],
      countryOfRegistration:[''],
      registrationCertificateNo:['']
    });

    this.areaOfFocusForm = this.fb.group({
      areaOfFocus:[[]],
      geographicCoverage:[[]]
    });

    this.experienceForm =this.fb.group({
      majorDonor:[''],
      startDate:[''],
      endDate:[''],
      projectValue:[''],
      experienceDescription:['']
    })

    this.contactPersonForm= this.fb.group({
      contactType:[''],
      emailAddress:[''],
      phoneNumber:['']
    })
  }

  onSelectChange(event: any) {
      const selectedProjects = this.areaOfFocusForm.get('selectedProjects') as FormArray;

    if (event.target.checked) {
      selectedProjects.push(this.fb.control(event.target.value));
    } else {
      const index = selectedProjects.controls.findIndex(x => x.value === event.target.value);
      selectedProjects.removeAt(index);
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  triggerFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileUpload(file);
      }
    };
    fileInput.click();
  }

  private handleFileUpload(file: File) {
    const newDocument: UploadedDocument = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.includes('pdf') ? 'PDF' : 'Image',
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    this.uploadedDocuments.push(newDocument);
  }

  viewDocument(document: UploadedDocument) {
    console.log('Viewing document:', document.name);
  }

  deleteDocument(documentId: string) {
    this.uploadedDocuments = this.uploadedDocuments.filter(doc => doc.id !== documentId);
  }

  deleteAreaOfFocus() {
  }

  // addBankAccount() {
  //   if (this.bankDetailsForm.valid) {
  //     const newAccount: BankAccount = {
  //       id: Date.now().toString(),
  //       ...this.bankDetailsForm.value
  //     };
  //     this.bankAccounts.push(newAccount);
  //     this.bankDetailsForm.reset();
  //   }
  // }

  onSubmit() {
    // Only navigate when user explicitly submits the form
    if (this.personalInfoForm.valid) {
      console.log('Registration submitted');
      console.log('Personal Info:', this.personalInfoForm.value);
      console.log('Bank Accounts:', this.bankAccounts);
      console.log('Documents:', this.uploadedDocuments);

      // Show success message and navigate to login after delay
      alert('Registration successful! You will be redirected to login.');

      // Add a delay before navigation to let user see the success message
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      console.log('Form is invalid');
    }
  }

  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
