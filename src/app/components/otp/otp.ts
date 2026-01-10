import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss'
})
export class Otp {

  OTPForm: FormGroup
  maskedEmail: string = '';
  email: string = 'koech36@gmail.com';

  constructor(private fb: FormBuilder, private router: Router){
    this.OTPForm=this.fb.group({
       otp:['',Validators.required]
    })

  }

  ngOnInit(): void {
    if (this.email) {
      this.maskedEmail = this.maskEmail(this.email);
    }
  }


  onVerifyOTP(){}

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

}
