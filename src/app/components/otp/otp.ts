import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthUser } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class Otp {

  OTPForm: FormGroup
  maskedEmail: string = '';
  user: AuthUser | null = null;
  email:any;
  loading = false;
  status: any;
  company:any;

  constructor(private fb: FormBuilder, private router: Router,
     private authService: AuthService,private notificationService: NotificationService){
  }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
   this.status=this.user?.status;
    this.email=localStorage.getItem('emailAddress')
    this.company=localStorage.getItem('company')
    this.OTPForm=this.fb.group({
       otpCode:['',Validators.required],
       company:['',Validators.required],
    })
    if (this.email) {
      this.maskedEmail = this.maskEmail(this.email);
    }
  }


  goToLogin(){
    this.router.navigate(['/login']);
  }

  private maskEmail(email: string): string {
     const [username, domain] = email.split('@');
      if (username.length <= 2) {
        return username[0] + '*' + '@' + domain;
      }

      const firstChar = username[0];
      const lastChar = username[username.length - 1];
      const maskedMiddle = '*'.repeat(username.length - 2);

      return firstChar + maskedMiddle + lastChar + '@' + domain;
      }

  onVerifyOTP() {
    this.loading=true;
    let formValues = this.OTPForm.value;
    formValues.emailAddress = this.email;
    formValues.company = this.company;
    this.authService.verifyOTP(this.OTPForm.value).subscribe({
    next: (res) => {
    this.loading = false;
    this.notificationService.success('', res.responseDescription);
        if (this.status === 'Approved') {
          this.router.navigate(['/funding-request']);
        } else {
          this.router.navigate(['/register']);
        }
  },
  error: (err) => {
    this.loading = false;
    const message = err.error?.responseDescription;
    this.notificationService.warning('', message);
  }
  });
}


resendOtp(){
     this.loading=true;
      this.authService.generateOTP(this.email, this.company).subscribe({
        next: (res) => {
        this.loading = false;
        this.notificationService.success('', res.responseDescription);
        this.router.navigate(['/otp-verification'])
      },
      error: (err) => {
        this.loading = false;
        const message = err.error?.responseDescription;
        this.notificationService.warning('', message);
      }
      });

  }

}
