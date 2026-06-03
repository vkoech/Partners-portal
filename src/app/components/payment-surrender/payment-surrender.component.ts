import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthService, AuthUser } from '../../services/auth.service';
import { CashRequestService } from '../../services/cash-request-service';
import { NotificationService } from '../../services/notification.service';
import { CashSurrenderService } from '../../services/cash-surrender-service';

@Component({
  selector: 'app-payment-surrender',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './payment-surrender.component.html',
  styleUrls: ['./payment-surrender.component.scss']
})
export class PaymentSurrenderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sidebarOpen = false;
  pageSize = 8;
  totalPages = 0;
  pagedList: any[] = [];
  filteredList:any;
  currentPage = 1;
  searchTerm: string = '';


  email: any
  company: any
  user: AuthUser | null = null;
  subgranteeNo: any;
  loading=false;
  payment_request:  any[] = [];
  paymentSurrenderList: any[] = [];

  private router = inject(Router);
  private cashRequestService = inject(CashRequestService);
  private authService = inject(AuthService);
  private notificationService=inject(NotificationService);
  private cashSurrenderService=inject(CashSurrenderService)


  ngOnInit(): void {
      this.user = this.authService.getLoggedInUser();
      this.subgranteeNo = this.user?.partnerAccountNo;
      this.email=this.user?.emailAddress;
      this.company=this.user?.companyKey;

      this.cashSurrenderService.getAllCashSurrenders(this.email, this.company).subscribe(data=>{
       this.paymentSurrenderList=data;
       this.paymentSurrenderList.sort((a, b) => {
       const numA = parseInt(a.no.split('-')[2], 10);
       const numB = parseInt(b.no.split('-')[2], 10);
        return numB - numA; // descending
        });
      this.filteredList = [...this.paymentSurrenderList];
      this.totalPages = Math.ceil(this.filteredList.length / this.pageSize);
      this.setPage(1)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

createNewSurrender(){
    const formValues = {
      subgranteeNo: this.subgranteeNo,
      emailAddress: this.email,
      company:this.company,
      no: '',
      status: '',
      actualSpent: '',
      areaOfFocus: '',
      description: '',
      projectCode: '',
      currencyCode: '',
      requestedDate: '',
      surrenderDate: '',
      actualSpentLCY: '',
      disbursedAmount: '',
      paymentRequestNo: '',
      disbursedAmountLCY: ''
    };
    this.cashSurrenderService.createUpdateCashSurrender(formValues).subscribe({next:(res) => {
     this.router.navigate(['/new-payment-surrender',btoa(res.responseDescription)]);
        },
          error: (err) => {
              this.loading = false;
              const message = err.error?.responseDescription || 'Failed to update request.';
              this.notificationService.error('', message);
            }
        });
      }
  ViewRequest(no: string){
    this.router.navigate(['/view-payment-surrender',btoa(no)]);
  }

  editRequest(no: string) {
      this.router.navigate([
       '/new-payment-surrender',
        btoa(no)
      ]);
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
        this.paymentSurrenderList = [...this.filteredList];
        return;
      }
      this.paymentSurrenderList = this.filteredList.filter((list: any) =>
        list.no?.toLowerCase().includes(q) ||
        list.requestedDate?.toString().toLowerCase().includes(q) ||
        list.projectCode?.toLowerCase().includes(q) ||
        String(list.actualSpentLCY).toLowerCase().includes(q) ||
        list.status?.toLowerCase().includes(q)
  );
}
}
