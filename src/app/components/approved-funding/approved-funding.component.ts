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
  itemsPerPage = 5;

  paymentRequestList: any
  email: any
  user: AuthUser | null = null;
  subgranteeNo: any;

  get totalPages(): number {
    return Math.ceil(this.paymentRequestList.length / this.itemsPerPage);
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.paymentRequestList.slice(startIndex, endIndex);
  }

  constructor(private router: Router,
   private paymentService: Payment,
   private authService: AuthService,
   private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.subgranteeNo = this.user?.partnerAccountNo;
    this.email=this.user?.emailAddress;
    this.paymentService.getApprovedFundApplications(this.email).subscribe(data=>{
     this.paymentRequestList=data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  ViewRequest(no: string){
      this.router.navigate(['/view-approved-funds-application',btoa(no)]);
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
