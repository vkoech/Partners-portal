import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUser, AuthService } from '../../../services/auth.service';
import { Payment } from '../../../services/payment';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-view-approved-funding',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './view-approved-funding.html',
  styleUrl: './view-approved-funding.scss'
})
export class ViewApprovedFunding {
  sidebarOpen: any;
  paymentRequestForm: FormGroup<any>;
  paymentApplicationLines:any;
  no: string;
  email: any;
  company: any;
  user: AuthUser | null = null;
  subgranteeNo: any;
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private paymentService: Payment,
      private authService:AuthService
    ) {
      this.user = this.authService.getLoggedInUser();
      this.subgranteeNo = this.user?.partnerAccountNo;
      this.email=this.user?.emailAddress;
      this.company=this.user?.companyKey;
      const encodedNo = this.route.snapshot.paramMap.get('id');
        if (encodedNo) {
          this.no = atob(encodedNo);
        }
    }
  ngOnInit(): void {
        this.paymentRequestForm = this.fb.group({
        no: [{ value: '', disabled: true }],
        emailAddress: [{ value: '', disabled: true }],
        subgranteeNo: [{ value: '', disabled: true }],
        applicationDate: [{ value: '', disabled: true }],
        subAwardStartDate: [{ value: '', disabled: true }],
        subAwardEndDate: [{ value: '', disabled: true }],
        projectCode: [{ value: '', disabled: true }],
        currencyCode: [{ value: '', disabled: true }],
        reportingCycle: [{ value: '', disabled: true }],
        budgetAmount: [{ value: '', disabled: true }],
        budgetAmountLCY: [{ value: '', disabled: true }],
        subAwardTitle: [{ value: '', disabled: true }],
        areaOfFocus:[{ value: '', disabled: true }],
        description: [{ value: '', disabled: true }],
        declarationDone:[{ value: '', disabled: true }],
        declarationDate:[{ value: '', disabled: true }],
        status:[{ value: '', disabled: true }],
      })

      this.paymentService.getSingleFundingApplication(this.no,this.company).subscribe(data=>{
          this.paymentRequestForm.patchValue(data);
        });
      this.paymentService.getAllFundingApplicationLines(this.no, this.company).subscribe(data=>{
        this.paymentApplicationLines=data
      });

    }

   onCancel() {
    this.router.navigate(['/approved-funding']);
  }

}
