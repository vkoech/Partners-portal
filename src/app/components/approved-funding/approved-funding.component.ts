import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthService, AuthUser } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Payment } from '../../services/payment';

@Component({
  selector: 'app-approved-funding',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './approved-funding.component.html',
  styleUrls: ['./approved-funding.component.scss']
})
export class ApprovedFundingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sidebarOpen = false;
  searchTerm = '';
  currentPage = 1;
  pageSize = 8;
  filteredList:any;
  pagedList: any[] = [];
  paymentRequestList: any[] = [];
  email: any
  company: any
  user: AuthUser | null = null;
  subgranteeNo: any;
  totalPages = 0;

  constructor(private router: Router,
   private paymentService: Payment,
   private authService: AuthService,
   private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.subgranteeNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
    this.company=this.user?.companyKey;
    this.paymentService.getApprovedFundApplications(this.email,this.company).subscribe(data=>{
    this.paymentRequestList=data;
    this.paymentRequestList.sort((a, b) => {
    const numA = parseInt(a.no.split('-')[2], 10);
    const numB = parseInt(b.no.split('-')[2], 10);
    return numB - numA;
    });
      this.filteredList = [...this.paymentRequestList];
      this.totalPages = Math.ceil(this.filteredList.length / this.pageSize);
      this.setPage(1)
     })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ViewRequest(no: string){
      this.router.navigate(['/view-approved-funds-application',btoa(no)]);
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
