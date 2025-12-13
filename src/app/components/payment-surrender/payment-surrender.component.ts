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
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;


  email: any
  user: AuthUser | null = null;
  subgranteeNo: any;
  loading=false;
  payment_request:  any[] = [];

  paymentSurrenderList: any[] = [];

  get totalPages(): number {
    return Math.ceil(this.paymentSurrenderList.length / this.itemsPerPage);
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.paymentSurrenderList.slice(startIndex, endIndex);
  }
  private router = inject(Router);
  private cashRequestService = inject(CashRequestService);
  private authService = inject(AuthService);
  private notificationService=inject(NotificationService);
  private cashSurrenderService=inject(CashSurrenderService)


  ngOnInit(): void {
      this.user = this.authService.getLoggedInUser();
      this.subgranteeNo = this.user?.partnerAccountNo;
      this.email=this.user?.emailAddress;

      this.cashSurrenderService.getAllCashSurrenders(this.email).subscribe(data=>{
       this.paymentSurrenderList=data;
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

  lastPage() {
    this.currentPage = this.totalPages;
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
}
