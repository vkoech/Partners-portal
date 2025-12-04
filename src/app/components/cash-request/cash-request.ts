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
    searchTerm = '';
    currentPage = 1;
    itemsPerPage = 5;
  
    cash_request_list: any[] = [];
    email: any
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
  
      this.cashRequestService.getAllCashRequests(this.email).subscribe(data=>{
       this.cash_request_list=data;
      });
    }
  
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
   createNewPaymentRequest (){
         const formValues = {
            subgranteeNo: this.subgranteeNo,
            emailAddress: this.email
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
     getSingleFundingApplication(){
        this.cashRequestService.getSingleCashRequest(this.email).subscribe(data=>{
        // this=data;
        });
      }
  
    editRequest(no: string) {
      this.router.navigate(['/new-cash-request',btoa(no)]);
    }
  
    viewRequest(id: string) {
      this.router.navigate(['/view-payment-request', id]);
    }
  
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }

}
