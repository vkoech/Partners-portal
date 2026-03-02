import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashRequestService {
  private httpClient = inject(HttpClient)
  private baseUrl = environment.apiUrl;


  getAllCashRequests(email: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashRequest/GetAllCashRequests/${encodeURIComponent(email)}`,
        { params }
      );
    }
 getSingleCashRequest(documentNo: string, company: string): Observable<any> {
    const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashRequest/GetSingleCashRequest/${encodeURIComponent(documentNo)}`,
        { params }
      );
    }
 getAllCashRequestLines(documentNo: string, company: string): Observable<any> {
    const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashRequest/GetAllCashRequestLines/${encodeURIComponent(documentNo)}`,
        { params }
      );
    }

  getApprovedFundingRequests(emailAddress: string, company: string): Observable<any> {
    const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}CashRequest/GetApprovedFundingRequests/${encodeURIComponent(emailAddress)}`,
        { params }
      );
    }

 createUpdateCashRequest(applicationBody: any): Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + 'CashRequest/CreateUpdateCashRequest', applicationBody);
    }
 createUpdateCashRequestLine(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'CashRequest/CreateUpdateCashRequestLine', applicationBody);
  }

  deleteLine(lineNo: string, documentNo: string, company: string): Observable<any> {
    const params = new HttpParams().set('company', company);
    return this.httpClient.delete<any>(
      `${this.baseUrl}CashRequest/DeleteCashRequestLine/${encodeURIComponent(lineNo)}/${encodeURIComponent(documentNo)}`,
      { params }
    );
  }
 getCashRequestDocuments(): Observable<any>{
      return this.httpClient.get<any>(this.baseUrl+'Document/getCashRequestDocuments');
    }
}
