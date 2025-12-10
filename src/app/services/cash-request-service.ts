import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashRequestService {
  private httpClient = inject(HttpClient)
  private baseUrl = environment.apiUrl;

 getAllCashRequests(email: string): Observable<any>{
        return this.httpClient.get<any>(this.baseUrl+'CashRequest/GetAllCashRequests/'+email);
      }
 getSingleCashRequest(documentNo: string): Observable<any>{
        return this.httpClient.get<any>(this.baseUrl+'CashRequest/GetSingleCashRequest/'+documentNo);
      }
 getAllCashRequestLines(documentNo: string): Observable<any>{
     return this.httpClient.get<any>(this.baseUrl+'CashRequest/GetAllCashRequestLines/'+documentNo);
    }

 getApprovedFundingRequests(emailAddress: string): Observable<any>{
     return this.httpClient.get<any>(this.baseUrl+'CashRequest/GetApprovedFundingRequests/'+emailAddress);
    }
 createUpdateCashRequest(applicationBody: any): Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + 'CashRequest/CreateUpdateCashRequest', applicationBody);
    }
 createUpdateCashRequestLine(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'CashRequest/CreateUpdateCashRequestLine', applicationBody);
  }
 deleteLine(lineNo: string, documentNo: string): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl+'CashRequest/DeleteCashRequestLine/'+ lineNo+'/'+documentNo);
    }  
}
