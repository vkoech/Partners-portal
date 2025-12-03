import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Payment {

  private httpClient = inject(HttpClient)

  private baseUrl = environment.apiUrl;

  getAllFundingApplications(email: string): Observable<any>{
      return this.httpClient.get<any>(this.baseUrl+'FundingApplication/GetAllFundingApplications/'+email);
    }
  getSingleFundingApplication(documentNo: string): Observable<any>{
      return this.httpClient.get<any>(this.baseUrl+'FundingApplication/GetSingleFundingApplication/'+documentNo);
    }
  getAllFundingApplicationLines(documentNo: string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'FundingApplication/GetAllFundingApplicationLines/'+documentNo);
  }

  getSingleFundingApplicationLine(lineNo: string, documentNo: string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'FundingApplication/GetSingleFundingApplicationLine/'+ lineNo+'/'+documentNo);
  }

  deleteFundingApplicationLine(lineNo: string, documentNo: string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'FundingApplication/DeleteFundingApplicationLine/'+ lineNo+'/'+documentNo);
  }
  createUpdateFundingApplication(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/CreateUpdateFundingApplication', applicationBody);
  }

}
