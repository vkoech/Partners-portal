import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashSurrenderService {

  private httpClient = inject(HttpClient)
  private baseUrl = environment.apiUrl;

   getAllCashSurrenders(email: string): Observable<any>{
          return this.httpClient.get<any>(this.baseUrl+'CashSurrender/GetAllCashSurrenders/'+email);
        }
   getSingleCashRequest(documentNo: string): Observable<any>{
          return this.httpClient.get<any>(this.baseUrl+'CashRequest/GetSingleCashRequest/'+documentNo);
        }
   getAllCashSurrenderLines(documentNo: string): Observable<any>{
       return this.httpClient.get<any>(this.baseUrl+'CashSurrender/GetAllCashSurrenderLines/'+documentNo);
      }
   createUpdateCashSurrender(applicationBody: any): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl + 'CashSurrender/CreateUpdateCashSurrender', applicationBody);
      }
   createUpdateCashSurrenderLine(applicationBody: any): Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + 'CashSurrender/CreateUpdateCashSurrenderLine', applicationBody);
    } 


  
}
