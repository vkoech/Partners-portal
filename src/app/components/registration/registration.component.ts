import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration-service';
import { AuthService, AuthUser } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
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
  totalSteps = 7;
  contact_type_list: any
  personalInfoForm: FormGroup;
  areaOfFocusForm: FormGroup;
  contactPersonForm: FormGroup;
  docuumentForm: FormGroup;
  SummaryForm: FormGroup;
  experienceForm: FormGroup;
  geographicCoverageForm: FormGroup;
  user: AuthUser | null = null;
  documentNo: any;
  stepCompleted: boolean[] = Array(this.totalSteps + 1).fill(false);
  area_of_focus_items: any
  geolocatio_Items:any
  contact_type: any
  contact_person_details_list:any[] = []
  contact_person_details_list_line:any
  areaOfFocusList: any[] = []
  areaOfFocusListLine:any
  geoCoverageList:any[] = []
  geoCoverageListLine:any
  experience:any[] = []
  uploadedDocuments: UploadedDocument[] = [];
  loading=false
  isConfirmed = false;
  email: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.documentNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
    this.getAreaOfFocus()
    this.getContactType()
    this.getContactsPersonByDocumentNo()
    this.getAreasOfFocusByDocumentNo()
    this.getGeoCoverageByDocumentNo()
    this.getPatnerExperience()
    this.getGeoLocation()
    this.getPartnersProfile()
  }

  private initializeForms() {
    this.personalInfoForm = this.fb.group({
      documentNo:[''],
      taxRegistrationNumber: [''],
      legalNameOfOrganization: [''],
      physicalAddress: [''],
      phoneNo: [''],
      tradingName: [''],
      dateRegistered:[''],
      governingBody:[''],
      acronym: [''],
      ngoType: [''],
      emailAddress: [''],
      postalAddress: [''],
      website: [''],
      country:[''],
      registrationCertificateNo:['']
    });

    this.areaOfFocusForm = this.fb.group({
      lineNo:0,
      documentNo:[''],
      description:[''],
      code:[''],
      action:['']
    });

   this.geographicCoverageForm = this.fb.group({
      lineNo:0,
      documentNo:[''],
      country:[''],
      action:['']
    });

    this.experienceForm =this.fb.group({
      lineNo:0,
      documentNo:[''],
      majorDonorOrPartner:[''],
      startDate:[''],
      endDate:[''],
      projectValue:[''],
      description:[''],
      action:['']
    })

    this.contactPersonForm= this.fb.group({
      lineNo:0,
      documentNo:[''],
      contactType:[''],
      emailAddress:[''],
      phoneNo:[''],
      names:[''],
      action:['']
    })
  }

  onSubmitPersonalInfo(){
     this.loading=true
        if( this.personalInfoForm.valid){
        let formValues = this.personalInfoForm.value;
        formValues.documentNo = this.documentNo;
        this.registrationService.createContactPersonInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        // this.router.navigate(['purchase-requisition']);
        this.getPatnerExperience();
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
        this.personalInfoForm.markAllAsTouched();
      }

  }

  onSubmitAreaOfFocusInfo(){
      this.loading=true
        if( this.areaOfFocusForm.valid){
        let formValues = this.areaOfFocusForm.value;
        formValues.documentNo = this.documentNo;
        this.registrationService.createAreaOfFocusInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        // this.router.navigate(['purchase-requisition']);
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
        this.areaOfFocusForm.markAllAsTouched();
      }
  }

  onSubmitGeographicCoverageInfo(){
     this.loading=true
        if( this.geographicCoverageForm.valid){
        let formValues = this.geographicCoverageForm.value;
        formValues.documentNo = this.documentNo;
        this.registrationService.createGeoLocationInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        // this.router.navigate(['purchase-requisition']);
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
        this.geographicCoverageForm.markAllAsTouched();
      }
  }

  contactPersonInfo(){
      this.loading=true
        if( this.contactPersonForm.valid){
        let formValues = this.contactPersonForm.value;
        formValues.documentNo = this.documentNo;
        this.registrationService.createContactPersonInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        // this.router.navigate(['purchase-requisition']);
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
        this.contactPersonForm.markAllAsTouched();
      }
  }

  onSubmitExperienceInfo(){
     this.loading=true
        if( this.experienceForm.valid){
        let formValues = this.experienceForm.value;
        formValues.documentNo = this.documentNo;
        formValues.action = 'Create';
        this.registrationService.createExperience(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        // this.router.navigate(['purchase-requisition']);
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
        this.experienceForm.markAllAsTouched();
      }
  }

  onSubmit(){

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


  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPartnersProfile(){
   this.registrationService.getPartnersProfile(this.email).subscribe(data => {
      this.personalInfoForm.patchValue(data)
    });
  }

  getAreaOfFocus(){
   this.registrationService.getAreaOfFocus().subscribe(data => {
      this.area_of_focus_items = data;
    });
  }

  getGeoLocation(){
   this.registrationService.getGeoLocation().subscribe(data => {
      this.geolocatio_Items = data;
    });
  }

   getContactType(){
   this.registrationService.getContactType().subscribe(data => {
      this.contact_type_list = data;
    });
    }
    getContactsPersonByDocumentNo(){
        this.registrationService.getContactsPersonByDocumentNo(this.documentNo).subscribe(data=>{
        this.contact_person_details_list=data
        })
      }

    getContactPersonLine(row: any){
        this.registrationService.getContactPersonLine(this.documentNo, row.lineNo ).subscribe(data=>{
        this.contact_person_details_list_line=data
        })
      }
   getAreasOfFocusByDocumentNo(){
    this.registrationService.getAreasOfFocusByDocumentNo(this.documentNo).subscribe(data=>{
      this.areaOfFocusList=data
    })
   }

   getAreasOfFocusLine(row:any){
    this.registrationService.getAreasOfFocusLine(this.documentNo,row.lineNo).subscribe(data=>{
      this.areaOfFocusListLine=data
    })
   }
   getGeoCoverageByDocumentNo(){
    this.registrationService.getGeoCoverageByDocumentNo(this.documentNo).subscribe(data=>{
     this.geoCoverageList=data
    })
   }
   getGeoCoverageLine(row:any){
    this.registrationService.getGeoCoverageLine(this.documentNo, row.lineNo).subscribe(data=>{
     this.geoCoverageListLine=data
    })
   }

  getPatnerExperience(){
    this.registrationService.getPatnerExperience(this.documentNo).subscribe(data=>{
      this.experience=data
    })
   }

}
