import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { RegistrationService } from '../../../services/registration-service';
import { NotificationService } from '../../../services/notification.service';
import { Payment } from '../../../services/payment';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  providers: [DatePipe]
})
export class Profile {

  personalInfoForm: FormGroup;
  areaOfFocusForm: FormGroup;
  contactPersonForm: FormGroup;
  documentForm: FormGroup;
  SummaryForm: FormGroup;
  confirmForm: FormGroup;
  experienceForm: FormGroup;
  geographicCoverageForm: FormGroup;
  boardMemberForm: FormGroup;
  staffMemberForm: FormGroup;
  user: AuthUser | null = null;
  documentNo: any;
   email: any;
  contact_person_details_list:any[] = []
  contact_person_details_list_line:any
  communication_details_list: any
  areaOfFocusList: any[] = []
  staff_members_list_line:any[]=[]
  board_members_list_line:any[]=[]
  areaOfFocusListLine:any
  geoCoverageList:any[] = []
  geoCoverageListLine:any
  currency_code_list: any
  experience:any[] = []
  uploadedDocuments: any[] = [];
  showModal = false;
  showcontactModal = false;
  showBoardMembersModal = false;
  showStaffMembersModal = false;
  loading=false;
  isEditMode = false;
  contact_type_list: any;


    constructor(
    private router: Router,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private paymentService: Payment,
    private datePipe: DatePipe,
  ) {
       this.paymentService.getcurrencyCodes().subscribe(data=>{
        this.currency_code_list=data;
      });
  }



ngOnInit(): void {
  this.user = this.authService.getLoggedInUser();
  this.documentNo = this.user?.partnerAccountNo;
  this.email=this.user?.emailAddress;
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
      registrationCertificateNo:['',Validators.required],
      status:['']
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
      majorDonorOrPartner:['', Validators.required],
      projectType:['', Validators.required],
      currencyCode:['', Validators.required],
      startDate:['', Validators.required],
      endDate:['', Validators.required],
      projectValue:['', Validators.required],
      description:['', Validators.required],
      action:['']
    }),

  this.contactPersonForm= this.fb.group({
      lineNo:0,
      documentNo:[''],
      contactType:['', Validators.required],
      roleType:['', Validators.required],
      emailAddress:['', Validators.required],
      phoneNo:['', Validators.required],
      names:['', Validators.required],
      action:['']
    })

    this.boardMemberForm=this.fb.group({
      lineNo:0,
      documentNo:['',Validators.required],
      names:['',Validators.required],
      phoneNo:['',Validators.required],
      emailAddress:['',Validators.required],
      position:['',Validators.required],
      affiliation:['',Validators.required]
    })

     this.staffMemberForm=this.fb.group({
      lineNo:0,
      documentNo:[''],
      name:['',Validators.required],
      phoneNo:['',Validators.required],
      emailAddress:['',Validators.required],
      position:[,Validators.required],
    })

      this.registrationService.getPartnersProfile(this.email).subscribe(data => {
        if (data.dateRegistered) {
          const parts = data.dateRegistered.split('/');
          data.dateRegistered = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
        }
        this.personalInfoForm.patchValue(data);
      });

       this.registrationService.getAreasOfFocusByDocumentNo(this.documentNo).subscribe(data=>{
          this.areaOfFocusList=data
        })
        this.registrationService.getAreasOfFocusByDocumentNo(this.documentNo).subscribe(data=>{
            this.areaOfFocusList=data
          })
    this.registrationService.getGeoCoverageByDocumentNo(this.documentNo).subscribe(data=>{
     this.geoCoverageList=data
    })
    this.getPatnerExperience();
    this.getContactsPersonByDocumentNo();
  }

  getContactType(){
   this.registrationService.getContactType().subscribe(data => {
      this.contact_type_list = data;
    });
    }

 openCustomModal() {
    this.showModal = true;
    this.isEditMode = false;
  }
  editRequest(row: any) {
      let formattedStartDate = '';
    if (row.startDate) {
      const startParts = row.startDate.split('/');
      if (startParts.length === 3) {
        formattedStartDate = `${startParts[2]}-${startParts[1].padStart(2, '0')}-${startParts[0].padStart(2, '0')}`;
      } else {
        formattedStartDate = this.datePipe.transform(new Date(row.startDate), 'yyyy-MM-dd') || '';
      }
    }

    let formattedEndDate = '';
    if (row.endDate) {
      const endParts = row.endDate.split('/');
      if (endParts.length === 3) {
        formattedEndDate = `${endParts[2]}-${endParts[1].padStart(2, '0')}-${endParts[0].padStart(2, '0')}`;
      } else {
        formattedEndDate = this.datePipe.transform(new Date(row.endDate), 'yyyy-MM-dd') || '';
      }
    }
    this.showModal = true;
    this.isEditMode = true;
    this.experienceForm.patchValue({
        ...row,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        action: 'update'
      });
    }
 openContactCustomModal() {
    this.showcontactModal = true;
    this.getContactType()
    this.isEditMode = false;
  }

   openSatffCustomModal() {
    this.showStaffMembersModal = true;
    this.isEditMode = false;
  }

   openBoardCustomModal() {
    this.showBoardMembersModal = true;
    this.isEditMode = false;
  }
  editContactRequest(contact: any) {
    this.showcontactModal = true;
    this.getContactType()
    this.isEditMode = true;
    this.contactPersonForm.patchValue({
        ...contact,
        action: 'update'
      });
    }

  onSubmitExperienceInfo(){
    const actionType = this.isEditMode ? 'update' : 'create';
     this.loading=true
        if( this.experienceForm.valid){
        let formValues = this.experienceForm.value;
        formValues.documentNo = this.documentNo;
        formValues.action=actionType;
        this.registrationService.createExperience(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.experienceForm.reset();
        this.getPatnerExperience();
        this.closeCustomModal();
        this.experienceForm.reset();
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
        this.experienceForm.markAllAsTouched();
      }
  }

 contactPersonInfo(){
      this.loading=true
      const actionType = this.isEditMode ? 'update' : 'create';
        if( this.contactPersonForm.valid){
        let formValues = this.contactPersonForm.value;
        formValues.documentNo = this.documentNo;
        formValues.action=actionType
        this.registrationService.createContactPersonInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        this.getContactsPersonByDocumentNo();
        this.closeContactModal();
        this.contactPersonForm.reset();
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
        this.contactPersonForm.markAllAsTouched();
      }
  }

  getContactsPersonByDocumentNo(){
    this.registrationService.getContactsPersonByDocumentNo(this.documentNo).subscribe(data=>{
    this.contact_person_details_list=data
    })
  }

  getPatnerExperience(){
     this.registrationService.getPatnerExperience(this.documentNo).subscribe(data=>{
     this.experience=data
    })
  }
 closeCustomModal() {
    this.showModal = false;
  }
 closeContactModal() {
    this.showcontactModal = false;
  }

boardInfo(){
  this.loading=true
  const actionType = this.isEditMode ? 'update' : 'create';
    if( this.boardMemberForm.valid){
        let formValues = this.boardMemberForm.value;
        formValues.documentNo = this.documentNo;
        formValues.action=actionType
        this.registrationService.createContactPersonInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        // this.getContactsPersonByDocumentNo();
        this.closeboardModal();
        this.boardMemberForm.reset();
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
        this.contactPersonForm.markAllAsTouched();
      }
}

staffInfo(){
       this.loading=true
      const actionType = this.isEditMode ? 'update' : 'create';
        if( this.staffMemberForm.valid){
        let formValues = this.staffMemberForm.value;
        formValues.documentNo = this.documentNo;
        formValues.action=actionType
        this.registrationService.createContactPersonInfo(formValues).subscribe({next:(res) => {
        this.notificationService.success('', res['responseDescription']);
        // this.getContactsPersonByDocumentNo();
        this.closeStaffModal();
        this.staffMemberForm.reset();
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
        this.contactPersonForm.markAllAsTouched();
      }
}


 closeboardModal() {
    this.showBoardMembersModal = false;
  }

 closeStaffModal() {
    this.showStaffMembersModal = false;
  }

  onCancel() {
    this.router.navigate(['/funding-request']);
  }


}
