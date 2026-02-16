import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

  SignUpForm: FormGroup;
  loading =false
  company_Items:any

  constructor(private fb: FormBuilder,  private authService: AuthService,
    private router: Router,
     private notificationService: NotificationService){

    // this.getCompany()

     this.SignUpForm = this.fb.group({
        emailAddress: ['', Validators.required],
        taxRegistrationNumber: ['', Validators.required],
        legalNameOfOrganization: ['', Validators.required],
        country:['']
      })
     }


  goToLogin(){
    this.router.navigate(['/login']);
  }

  onSignup(){
    this.loading=true;
    let formValues = this.SignUpForm.value;
    this.authService.registerPartner(formValues).subscribe({
    next: (res) => {
    this.loading = false;
    this.notificationService.success('', res.responseDescription);
    this.SignUpForm.reset();
    this.router.navigate(['/login']);
  },
  error: (err) => {
    this.loading = false;
    const message = err.error?.responseDescription;
    this.notificationService.warning('', message);
   }
   });

  }

  getCompany(){
   this.authService.getCompany().subscribe(data => {
      this.company_Items = data;
    });
  }

}
