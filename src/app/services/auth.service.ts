import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { jwtDecode } from 'jwt-decode';

export interface LoginCredentials {
  employeeNumber: string;
  password: string;
  captchaAnswer: string;
  rememberMe?: boolean;
}

export interface ResetPasswordRequest {
  employeeNumber: string;
  captchaAnswer: string;
}

export interface AuthUser {
  employeeNo: string;
  partnerAccountName: string;
  emailAddress: string;
  employmentDate: string;
  gender: string;
  phoneNo: string;
  dateOfBirth: string;
  bankName: string;
  companyName: string;
  partnerAccountNo: string;
  customerNo:string;
  status: string;

}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private baseUrl = environment.apiUrl;
 private refreshing = false;
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

constructor(private router: Router,private http: HttpClient) {}

 login(body: any): Observable<any>{
    return this.http.post<any>(this.baseUrl+'PartnerAccount/Login', body);
  }

  generateOTP(email: string): Observable<any> {
    const params = new HttpParams().set('emailAddress', email); return this.http.post<any>(
      this.baseUrl + 'PartnerAccount/GenerateOTP',{}, { params }
    );
  }

  verifyOTP(body: any): Observable<any>{
    return this.http.post<any>(this.baseUrl+'PartnerAccount/VerifyOTP', body);
  }

  resetPasswordLink(emailAddress: string, passwordResetToken: any) {
    return this.http.post<any>(`${this.baseUrl}PartnerAccount/SendPasswordActivationLink`, { emailAddress , passwordResetToken});
  }


  registerPartner(body: any): Observable<any>{
    return this.http.post<any>(this.baseUrl+'PartnerAccount/Register', body);
  }

  resetPassword(body: any): Observable<any>{
    return this.http.post<any>(this.baseUrl+'PartnerAccount/ResetPassword', body);
  }

  getCompany(): Observable<Array<any>>{
    return this.http.get<Array<any>>(this.baseUrl+'OData/countries');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  setTokens(jwt: string, refreshToken: string): void {
    localStorage.setItem('auth_token', jwt);
    localStorage.setItem('refreshToken', refreshToken);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<any>('/api/auth/refresh', { refreshToken }).pipe(
      switchMap(res => {
        this.setTokens(res.jwt, res.refreshToken);
        this.accessTokenSubject.next(res.jwt);
        return this.accessTokenSubject;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

 isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (e) {
      return true;
    }
  }




  getLoggedInUser(): AuthUser | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<AuthUser>(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
