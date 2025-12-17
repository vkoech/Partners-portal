import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Payment } from '../../services/payment';
import { AuthService, AuthUser } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-payment-request',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.scss']
})
export class PaymentRequestComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sidebarOpen = false;
  paymentRequestList: any[] = [];
  email: any
  user: AuthUser | null = null;
  subgranteeNo: any;
  loading=false;
  payment_request:  any[] = [];
  pageSize = 10;
  totalPages = 0;
  pagedList: any[] = [];
  filteredList:any;
  currentPage = 1;
  searchTerm: string = '';


  private router = inject(Router);
  private paymentService = inject(Payment);
  private authService = inject(AuthService);
  private notificationService=inject(NotificationService)

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.subgranteeNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
    this.paymentService.getAllFundingApplications(this.email).subscribe(data=>{
     this.paymentRequestList=data;
     this.filteredList = [...this.paymentRequestList=data];
     this.filteredList = [...this.paymentRequestList];
        this.totalPages = Math.ceil(this.filteredList.length / this.pageSize);
        this.setPage(1)

    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

 createNewPaymentRequest (){
       const formValues = {
          subgranteeNo: this.subgranteeNo,
          emailAddress: this.email,
          no:'',
          status: '',
          areaOfFocus: '',
          description: '',
          projectCode: '',
          budgetAmount: '',
          currencyCode: '',
          subAwardTitle: '',
          reportingCycle: '',
          applicationDate: '',
          budgetAmountLCY: '',
          declarationDate: '',
          declarationDone: '',
          obligatedAmount: '',
          obligatedAmountLCY: '',
          subAwardStartDate: '',
          subAwardEndDate: ''
       }
    this.paymentService.createUpdateFundingApplication(formValues).subscribe({next:(res) => {
     this.router.navigate(['/funding-request',btoa(res.responseDescription)]);
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to update request.';
              this.notificationService.error('', message);
            }
        });
      }
   getSingleFundingApplication(){
      this.paymentService.getAllFundingApplications(this.email).subscribe(data=>{
      this.paymentRequestList=data;
      });
    }

  editRequest(no: string) {
    this.router.navigate(['/funding-request',btoa(no)]);
  }
  ViewRequest(no: string){
     this.router.navigate(['/view-funding-request',btoa(no)]);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

   setPage(page: number): void {
     if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedList = this.paymentRequestList.slice(startIndex, endIndex);
      }
   search(): void {
      const q = this.searchTerm.toLowerCase().trim();
      if (!q) {
        this.paymentRequestList = [...this.filteredList];
        return;
      }
      this.paymentRequestList = this.filteredList.filter((list: any) =>
        list.no?.toLowerCase().includes(q) ||
        list.applicationDate?.toString().toLowerCase().includes(q) ||
        list.projectCode?.toLowerCase().includes(q) ||
        String(list.amount).toLowerCase().includes(q) ||
        list.amountLCY?.toLowerCase().includes(q) ||
        list.obligatedAmountLCY?.toLowerCase().includes(q) ||
        list.status?.toLowerCase().includes(q)
      );
}

}
