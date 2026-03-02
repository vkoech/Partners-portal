import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Payment {

  private httpClient = inject(HttpClient)

  private baseUrl = environment.apiUrl;

  getAllFundingApplications(email: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}FundingApplication/GetAllFundingApplications/${encodeURIComponent(email)}`,
        { params }
      );
    }

   getSingleFundingApplication(documentNo: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}FundingApplication/GetSingleFundingApplication/${encodeURIComponent(documentNo)}`,
        { params }
      );
    }
     getAllFundingApplicationLines(documentNo: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}FundingApplication/GetAllFundingApplicationLines/${encodeURIComponent(documentNo)}`,
        { params }
      );
    }

   getApprovedFundApplications(email: string, company: string): Observable<any> {
      const params = new HttpParams().set('company', company);
      return this.httpClient.get<any>(
        `${this.baseUrl}FundingApplication/GetApprovedFundApplications/${encodeURIComponent(email)}`,
        { params }
      );
    }

  getProjectDetails(documentNo: string, partnerNo: string, company: string): Observable<any> {
    const params = new HttpParams().set('company', company);
    return this.httpClient.get<any>(
      `${this.baseUrl}FundingApplication/GetProjectDetails/${encodeURIComponent(documentNo)}/${encodeURIComponent(partnerNo)}`,
      { params }
    );
  }
  getFundingApplicationDocuments(): Observable<any>{
      return this.httpClient.get<any>(this.baseUrl+'Document/getFundingApplicationDocuments');
    }

  getSingleFundingApplicationLine(lineNo: string, documentNo: string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'FundingApplication/GetSingleFundingApplicationLine/'+ lineNo+'/'+documentNo);
  }

  deleteFundingApplicationLine(lineNo: string, documentNo: string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'FundingApplication/DeleteFundingApplicationLine/'+ lineNo+'/'+documentNo);
  }
  createUpdateFundingApplication(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'FundingApplication/CreateUpdateFundingApplication', applicationBody);
  }
  createUpdateFundingApplicationLine(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'FundingApplication/CreateUpdateFundingApplicationLine', applicationBody);
  }
  getProjectCodes(partnerNo: string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'OData/getProjectCodes/'+ partnerNo);
  }

  getcurrencyCodes(company: string): Observable<any> {
    const params = new HttpParams().set('company', company);
    return this.httpClient.get<any>(
      `${this.baseUrl}OData/getCurrencies`,
      { params }
    );
  }  

 getReportingCycles(): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'OData/getReportingCycles');
  }
 getCategories(): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'OData/getCategories');
  }
 getActivityCodes(approvedFundingNo : string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'OData/getActivityCodes/'+ approvedFundingNo );
  }
 getFundingApplicationDetailsByNo(approvedFundingApplicationNo : string): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'CashRequest/GetFundingApplicationDetailsByNo/'+ approvedFundingApplicationNo);
  }
 uploadDocument(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'Document/upload', applicationBody);
  }
getCustomerStatement(
  customerNo: string, startDate: string, endDate: string) {
    return this.httpClient.get(
        `${this.baseUrl}Customer/GetCustomerStatement`,
        {
          params: { customerNo, startDate, endDate },
          responseType: 'blob',
          observe: 'response'
        }
      );
    }
}
