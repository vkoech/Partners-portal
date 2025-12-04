import { NotificationService } from './../../services/notification.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  [x: string]: any;
  email = '';
  password = '';
  rememberMe = false;
  LoginForm: FormGroup;
  loading = false;

  constructor(private router: Router, private fb: FormBuilder,
     private notificationService: NotificationService, private authService: AuthService) {

      this.LoginForm = this.fb.group({
        emailAddress: ['', Validators.required],
        password: ['', Validators.required],
        rememberMe: Boolean
      })
     }

  onLogin() {
    this.loading=true;
    this.authService.login(this.LoginForm.value).subscribe({
    next: (res) => {
    this.loading = false;

    localStorage.setItem('auth_token', res.jwt);
    localStorage.setItem('refreshToken', res.refreshToken || '');
    localStorage.setItem('userName', this.LoginForm.value.username);
    this.notificationService.success('', res.responseDescription);
      const decoded = this.decodeToken(res.jwt);
      if (decoded) {
        const status = decoded.status;
        if (status === 'Approved') {
          this.router.navigate(['/funding-request']);
        } else {
          this.router.navigate(['/register']);
        }
      }
  },
  error: (err) => {
    this.loading = false;
    const message = err.error?.responseDescription;
    this.notificationService.warning('', message);
  }
  });
}

decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}



goToReset(event?: Event) {
       this.router.navigate(['/forgot-password']);
  }

 goToRegister(event?: Event) {
    this.router.navigate(['/signup']);
  }
}
