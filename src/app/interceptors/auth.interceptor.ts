import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';import { AuthService } from '../services/auth.service';
;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

 private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
              switchMap(newToken => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(newToken);

                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                return next.handle(retryReq);
              }),
              catchError(err => {
                this.isRefreshing = false;
                this.authService.logout();
                return throwError(() => err);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(token => {
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` }
                });
                return next.handle(retryReq);
              })
            );
          }
        }

        return throwError(() => error);
      })
    );
  }
}
