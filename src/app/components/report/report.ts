import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuthService, AuthUser } from './../../services/auth.service';
import { Payment } from './../../services/payment';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './report.html',
  styleUrl: './report.scss'
})
export class Report {

   email: any
   user: AuthUser | null = null;
   customerNo: any;
   company:any;
   startDate: string;
   endDate: string
   reportForm!: FormGroup;
   pdfSrc: string | null = null;
   loading: boolean = false;


  private paymentService = inject(Payment);
  private authService = inject(AuthService);
  private fb=inject(FormBuilder);

  sidebarOpen: any;



  ngOnInit(): void {
  this.user = this.authService.getLoggedInUser();
  this.customerNo = this.user?.customerNo?? '';
  this.email = this.user?.emailAddress ?? '';
  this.company=this.user?.companyKey;

  this.reportForm = this.fb.group({
    startDate: [''],
    endDate: ['']
  });
  // this.reportForm.get('endDate')?.valueChanges.subscribe(() => {
  // });
}

  private formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

downloadStatement(): void {
  if (!this.reportForm) return;
  const startDate = this.formatDate(this.reportForm.get('startDate')?.value);
  const endDate = this.formatDate(this.reportForm.get('endDate')?.value);
  if (!startDate || !endDate) {
    return;
  }
  if (this.loading) return;

  this.loading = true;
  this.paymentService.getCustomerStatement(this.customerNo, startDate, endDate, this.company)
      .subscribe({
        next:(res)=>{
             const blob = res.body!;
      let filename = 'CustomerStatement.pdf';
      const contentDisposition = res.headers.get('content-disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      this.loading = false;
    },
    error: () => {
      this.loading = false;
      alert('Failed to download statement');
    }
  });
  }

}
