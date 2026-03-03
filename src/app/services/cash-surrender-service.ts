import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashSurrenderService {

  private httpClient = inject(HttpClient)
  private baseUrl = environment.apiUrl;


    getAllCashSurrenders(email: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashSurrender/GetAllCashSurrenders/${encodeURIComponent(email)}`,
        { params }
      );
    }
 
    getSingleCashSurrender(documentNo: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashSurrender/GetSingleCashSurrender/${encodeURIComponent(documentNo)}`,
        { params }
      );
    }

    getAllCashSurrenderLines(documentNo: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashSurrender/GetAllCashSurrenderLines/${encodeURIComponent(documentNo)}`,
        { params }
      );
    }
   createUpdateCashSurrender(applicationBody: any): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl + 'CashSurrender/CreateUpdateCashSurrender', applicationBody);
      }
   createUpdateCashSurrenderLine(applicationBody: any): Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + 'CashSurrender/CreateUpdateCashSurrenderLine', applicationBody);
    }

   getCashRequestDetailsByNo(documentNo: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashSurrender/GetCashRequestDetailsByNo/${encodeURIComponent(documentNo)}`,
        { params }
      );
    }

  getPostedCashRequests(emailAddress: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashSurrender/GetPostedCashRequests/${encodeURIComponent(emailAddress)}`,
        { params }
      );
    }

    validateCashSurrenderLines(cashSurrenderNo: string, disbursementNo: string, company: string): Observable<any> {
    const params = new HttpParams().set('company', company);
    return this.httpClient.get<any>(
      `${this.baseUrl}CashSurrender/ValidateCashSurrenderLines/${encodeURIComponent(cashSurrenderNo)}/${encodeURIComponent(disbursementNo)}`,
      { params }
    );
  }

  deleteCashSurrenderLine(lineNo: string, documentNo: string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'CashSurrender/DeleteCashSurrenderLine/'+ lineNo+'/'+documentNo);
  }

   getCashSurrenderDocuments(): Observable<any>{
      return this.httpClient.get<any>(this.baseUrl+'Document/getCashSurrenderDocuments');
    }

}
