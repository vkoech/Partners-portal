import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generate-otp',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './generate-otp.html',
  styleUrl: './generate-otp.scss'
})
export class GenerateOtp {

  generateOTPForm: FormGroup
  email:any;
  maskedEmail: string = '';
  loading = false;

  constructor(private fb: FormBuilder, private router: Router,
     private authService: AuthService,private notificationService: NotificationService){
  }


  ngOnInit(): void {
    this.email=localStorage.getItem('emailAddress')
    this.generateOTPForm=this.fb.group({
       emailAddress:['',Validators.required]
    })
    if (this.email) {
      this.maskedEmail = this.maskEmail(this.email);
    }
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


  generateOTP(){
     this.loading=true;
      this.authService.generateOTP(this.email).subscribe({
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

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
