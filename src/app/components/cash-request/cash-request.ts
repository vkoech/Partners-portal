import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthUser, AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Payment } from '../../services/payment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { CashRequestService } from '../../services/cash-request-service';

@Component({
  selector: 'app-cash-request',
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './cash-request.html',
  styleUrl: './cash-request.scss'
})
export class CashRequest {

  private destroy$ = new Subject<void>();

    sidebarOpen = false;
    pageSize = 8;
    totalPages = 0;
    pagedList: any[] = [];
    filteredList:any;
    currentPage = 1;
    searchTerm: string = '';

    cash_request_list: any[] = [];
    email: any
    company: any
    user: AuthUser | null = null;
    subgranteeNo: any;
    loading=false;
    payment_request:  any[] = [];

    private router = inject(Router);
    private cashRequestService = inject(CashRequestService);
    private authService = inject(AuthService);
    private notificationService=inject(NotificationService)

    ngOnInit(): void {
      this.user = this.authService.getLoggedInUser();
      this.subgranteeNo = this.user?.partnerAccountNo;
      this.email=this.user?.emailAddress;
      this.company=this.user?.companyKey;

      this.cashRequestService.getAllCashRequests(this.email,this.company).subscribe(data=>{
       this.cash_request_list=data;
       this.cash_request_list.sort((a, b) => {
       const numA = parseInt(a.no.split('-')[2], 10);
       const numB = parseInt(b.no.split('-')[2], 10);
       return numB - numA;
         });
      this.filteredList = [...this.cash_request_list];
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
            company:this.company,
            no: '',
            status: '',
            areaOfFocus: '',
            description: '',
            projectCode: '',
            currencyCode: '',
            documentDate: '',
            requestedDate: '',
            declarationDate: '',
            declarationDone: '',
            subAwardEndDate: '',
            subAwardStartDate: '',
            approvedApplicationNo: '',
            indirectCostPercentage: '',
         }
      this.cashRequestService.createUpdateCashRequest(formValues).subscribe({next:(res) => {
       this.router.navigate(['/new-cash-request',btoa(res.no)]);
          },
            error: (err) => {
                this.loading = false;
                const message = err.error?.responseDescription || 'Failed to update request.';
                this.notificationService.error('', message);
              }
          });
        }


   editRequest(no: string, approvedApplicationNo: string) {
      this.router.navigate([
       '/new-cash-request',
        btoa(no),
        btoa(approvedApplicationNo)
      ]);
    }
   ViewRequest(no: string,){
      this.router.navigate(['/view-cash-request',btoa(no)]);
    }

  setPage(page: number) {
    if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedList = this.filteredList.slice(startIndex, endIndex);
    }
  get pages(): number[] {
      return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }
  search(): void {
    const q = this.searchTerm.toLowerCase().trim();
      if (!q) {
          this.cash_request_list = [...this.filteredList];
      return;
      }
    this.cash_request_list = this.filteredList.filter((list: any) =>
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
