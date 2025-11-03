import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration-service';
import { AuthService, AuthUser } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule],
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
  isEditMode = false;
  dropdownSettings = {};
  selectedAreaOfFocusValues: any[] = [];
  selectedGeoValues: any[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.initializeForms();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'code',
      textField: 'description',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

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
      taxRegistrationNumber: ['',Validators.required],
      legalNameOfOrganization: ['',Validators.required],
      physicalAddress: ['',Validators.required],
      phoneNo: ['',Validators.required],
      tradingName: ['',Validators.required],
      dateRegistered:['',Validators.required],
      governingBody:['',Validators.required],
      acronym: [''],
      emailAddress: ['',Validators.required],
      postalAddress: ['',Validators.required],
      website: ['',Validators.required],
      country:['',Validators.required],
      registrationCertificateNo:['',Validators.required]
    });

    this.areaOfFocusForm = this.fb.group({
      lineNo:0,
      documentNo:[''],
      code:[[]],
      description:[''],
      action:['']
    });

   this.geographicCoverageForm = this.fb.group({
      lineNo:0,
      documentNo:[''],
      country:[[]],
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
    },
    {
    validators: this.dateRangeValidator
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


  dateRangeValidator(form: FormGroup) {
  const start = form.get('startDate')?.value;
  const end = form.get('endDate')?.value;
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);

  return endDate < startDate ? { dateRangeInvalid: true } : null;
}



  onSubmitPersonalInfo(){
     this.loading=true
        if( this.personalInfoForm.valid){
        let formValues = this.personalInfoForm.value;
        formValues.documentNo = this.documentNo;
        this.registrationService.createPartnerInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getPartnersProfile();
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
        this.personalInfoForm.markAllAsTouched();
      }

  }

  onSubmitAreaOfFocusInfo(actionType: string){
      this.loading=true
        if( this.areaOfFocusForm.valid){
        let formValues = this.areaOfFocusForm.value;
        const actionType = this.isEditMode ? 'update' : 'create';
        formValues.documentNo=this.documentNo,
        formValues.code=this.selectedAreaOfFocusValues,
        formValues.action=actionType
        this.registrationService.createAreaOfFocusInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getAreasOfFocusByDocumentNo()
        this.isEditMode = true;
        this.areaOfFocusForm.reset()
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
        formValues.country=this.selectedGeoValues;
        this.registrationService.createGeoLocationInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getGeoCoverageByDocumentNo()
        this.geographicCoverageForm.reset()
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
        this.getContactsPersonByDocumentNo()
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
  
 deleteConatacPerson(row: any, actionType:string){
  let formValues = this.areaOfFocusForm.value;
    formValues.action=actionType,
    formValues.lineNo=row.lineNo,
    formValues.contactType=row.contactType,
    formValues.emailAddress=row.emailAddress,
    formValues.phoneNo=row.phoneNo,
    formValues.names=row.names,
    formValues.majorDonorOrPartner=row.majorDonorOrPartner,
    formValues.documentNo=this.documentNo,
      this.registrationService.createContactPersonInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getContactsPersonByDocumentNo()
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to delete the request.';
              this.notificationService.error('', message);
            }
        })

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

 deleteExperience(row: any,actionType: string){
    let formValues = this.areaOfFocusForm.value;
    formValues.action=actionType,
    formValues.lineNo=row.lineNo,
    formValues.startDate=row.startDate,
    formValues.endDate=row.endDate,
    formValues.projectValue=row.projectValue,
    formValues.description=row.description,
    formValues.majorDonorOrPartner=row.majorDonorOrPartner,

    formValues.documentNo=this.documentNo,
      this.registrationService.createExperience(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getPatnerExperience()
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to delete the request.';
              this.notificationService.error('', message);
            }
        })
 }

  onSubmit(){

  }

  editAreaOfFocus(actionType: string){

  }



  onSelectChange(event: any) {
      const selectedProjects = this.areaOfFocusForm.get('code') as FormArray;

    if (event.target.checked) {
      selectedProjects.push(this.fb.control(event.target.value));
    } else {
      const index = selectedProjects.controls.findIndex(x => x.value === event.target.value);
      selectedProjects.removeAt(index);
    }
  }

nextStep() {
  if (this.currentStep === 1) {
    this.personalInfoForm.markAllAsTouched();

    if (this.personalInfoForm.invalid) {
      this.showRequiredAlert();
      return;
    }

    }

  if (this.currentStep === 2) {
    if (!this.areaOfFocusList || this.areaOfFocusList.length === 0) {
      this.showRequiredAlert();
      return;
    }
   }
   if (this.currentStep === 3) {
    if (!this.geoCoverageList || this.geoCoverageList.length === 0) {
      this.showRequiredAlert();
      return;
    }
   }

    if (this.currentStep === 4) {
      if (!this.experience || this.experience.length === 0) {
        this.showRequiredAlert();
        return;
      }
    }

    if (this.currentStep === 5) {
      if (!this.contact_person_details_list || this.contact_person_details_list.length === 0) {
        this.showRequiredAlert();
        return;
      }
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
}

showRequiredAlert() {
    this.notificationService.error('Error','Please fill all required fields marked with *',);
}


onGeoSelect(item: any){
  this.selectedGeoValues.push(item.country || item.code);
  }

 onGeoDeSelect(item: any){
      this.selectedGeoValues = this.selectedGeoValues.filter(
    (c) => c !== item.code
  ); }

 onGeoSelectAll(items: any) {
    this.selectedGeoValues = items.map((i: any) => i.country || i.code);
   }

 onGeoDeSelectAll(items: any) {
     this.selectedGeoValues = items.map((i: any) => i.code);
   }

 onAreaSelect(item: any){
    this.selectedAreaOfFocusValues.push(item.country || item.code);
  }

 onAreaDeSelect(item: any){
      this.selectedAreaOfFocusValues = this.selectedAreaOfFocusValues.filter(
    (c) => c !== item.code
  );
 }

 onAreaSelectAll(items: any) {
    this.selectedAreaOfFocusValues = items.map((i: any) => i.country || i.code);
   }

 onAreaDeSelectAll(items: any) {
     this.selectedAreaOfFocusValues = items.map((i: any) => i.code);
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

  deleteAreaOfFocus(lineNo:any, actionType: string) {
    let formValues = this.areaOfFocusForm.value;
    formValues.action=actionType,
    formValues.lineNo=lineNo,
    formValues.documentNo=this.documentNo,
      this.registrationService.createAreaOfFocusInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getAreasOfFocusByDocumentNo()
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to delete the request.';
              this.notificationService.error('', message);
            }
        })
  }

  deleteGeoCoverarge(lineNo:any, actionType: string){
     let formValues = this.geographicCoverageForm.value;
    formValues.action=actionType,
    formValues.lineNo=lineNo,
    formValues.documentNo=this.documentNo,
      this.registrationService.createGeoLocationInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getGeoCoverageByDocumentNo()
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to delete the request.';
              this.notificationService.error('', message);
            }
        })
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
