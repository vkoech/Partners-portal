import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUser, AuthService } from '../../../services/auth.service';
import { CashSurrenderService } from '../../../services/cash-surrender-service';
import { RegistrationService } from '../../../services/registration-service';

@Component({
  selector: 'app-view-payment-surrender',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './view-payment-surrender.html',
  styleUrl: './view-payment-surrender.scss'
})
export class ViewPaymentSurrender {
    paymentApplicationLines: any
    surrenderForm!: FormGroup;
    sidebarOpen: any;
    email: any;
    no: string;
    user: AuthUser | null = null;
    subgranteeNo:any;
    uploaded_document_list:any;

   constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService:AuthService,
    private cashSurrenderService: CashSurrenderService,
    private registrationService: RegistrationService
  ) {
    const encodedNo = this.route.snapshot.paramMap.get('id');
      if (encodedNo) {
        this.no = atob(encodedNo);
      }
    this.user = this.authService.getLoggedInUser();
    this.subgranteeNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
  }

    ngOnInit(): void {
      this.surrenderForm = this.fb.group({
      no: [{ value: '', disabled: true }],
      emailAddress: [{ value: '', disabled: true }],
      subgranteeNo: [{ value: '', disabled: true }],
      documentDate: [{ value: '', disabled: true }],
      paymentRequest: [{ value: '', disabled: true }],
      currencyCode: [{ value: '', disabled: true }],
      disbursedAmount: [{ value: '', disabled: true }],
      surrenderedAmount: [{ value: '', disabled: true }],
      startDate: [{ value: '', disabled: true }],
      endDate: [{ value: '', disabled: true }],
      surrenderDate: [{ value: '', disabled: true }],
      paymentRequestNo:[{ value: '', disabled: true }],
      description:[{ value: '', disabled: true }],
      status:[{ value: '', disabled: true }]
    });

      this.cashSurrenderService.getSingleCashSurrender(this.no).subscribe(data=>{
      this.surrenderForm.patchValue(data);
      });

      this.cashSurrenderService.getAllCashSurrenderLines(this.no).subscribe(data=>{
      this.paymentApplicationLines=data
    });
     this.registrationService.getUploadedPortalAttachments(this.no).subscribe(data=>{
      this.uploaded_document_list=data
    })
    }
  onCancel() {
    this.router.navigate(['/payment-surrender']);
  }

}
