import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { RegistrationService } from '../../../services/registration-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  personalInfoForm: FormGroup;
  areaOfFocusForm: FormGroup;
  contactPersonForm: FormGroup;
  docuumentForm: FormGroup;
  SummaryForm: FormGroup;
  confirmForm: FormGroup;
  experienceForm: FormGroup;
  geographicCoverageForm: FormGroup;
  user: AuthUser | null = null;
  documentNo: any;
   email: any;
  contact_person_details_list:any[] = []
  contact_person_details_list_line:any
  areaOfFocusList: any[] = []
  areaOfFocusListLine:any
  geoCoverageList:any[] = []
  geoCoverageListLine:any
  experience:any[] = []
  uploadedDocuments: any[] = [];

    constructor(
    private router: Router,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private authService: AuthService,
  ) {}



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
      majorDonorOrPartner:[''],
      projectType:[''],
      currencyCode:[''],
      startDate:[''],
      endDate:[''],
      projectValue:[''],
      description:[''],
      action:['']
    }),

  this.contactPersonForm= this.fb.group({
      lineNo:0,
      documentNo:[''],
      contactType:[''],
      roleType:[''],
      emailAddress:[''],
      phoneNo:[''],
      names:[''],
      action:['']
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
       this.registrationService.getContactsPersonByDocumentNo(this.documentNo).subscribe(data=>{
        this.contact_person_details_list=data
        })
       this.registrationService.getPatnerExperience(this.documentNo).subscribe(data=>{
          this.experience=data
        })
    this.registrationService.getGeoCoverageByDocumentNo(this.documentNo).subscribe(data=>{
     this.geoCoverageList=data
    })
  }





}
