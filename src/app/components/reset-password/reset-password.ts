import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {


  ResetPasswordForm: FormGroup;
  loading =false
  email: string
  passwordResetToken: any

  constructor(private router: Router,private fb: FormBuilder,private activatedRoutes: ActivatedRoute,
    private authService: AuthService, private notificationService: NotificationService){
  }

    ngOnInit(): void {
    this.email = this.activatedRoutes.snapshot.queryParams['email'];
    this.passwordResetToken = this.activatedRoutes.snapshot.queryParams['passwordResetToken'];

     this.ResetPasswordForm=this.fb.group({
      password: ['', [Validators.required, Validators.pattern('(?=.*[$@$!%*?&#<>{}()])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}')]],
      confirmPassword: ['', Validators.required],
      email:[''],
      // passwordResetToken:['']
    },
      {
      validators: this.passwordsMatchValidator
     });
   }
  get f() {  return this.ResetPasswordForm?.controls; }

   passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onReset(){
    this.loading=true;
    let formValues = this.ResetPasswordForm.value;
    formValues.email=this.email;
    this.authService.resetPassword(formValues).subscribe({
    next: (res) => {
    this.loading = false;
    this.notificationService.success('', res.responseDescription);
    this.router.navigate(['/login']);
  },
  error: (err) => {
    this.loading = false;
    const message = err.error?.responseDescription;
    this.notificationService.warning('', message);
   }
   });
  }

  goToReset(){}

  goToLogin(event?: Event){}

  goToRegister(event?: Event){}

}
