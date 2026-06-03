import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs/internal/Observable';
import { Profile } from '../components/registration/Profile';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  createPartnerInfo(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/update-profile', applicationBody);
  }

  createContactPersonInfo(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/contact-details', applicationBody);
  }

  createAreaOfFocusInfo(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/focus-area', applicationBody);
  }

  createExperience(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/program-exp', applicationBody);
  }

  uploadDocument(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'Document/upload', applicationBody);
  }

  getPartnerRegistrationMandatoryDocuments(company: string): Observable<any>{
    return this.httpClient.get<any[]>(this.baseUrl+'Document/GetPartnerRegistrationMandatoryDocuments?company='+company);
  }

  createGeoLocationInfo(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/geo-coverage', applicationBody);
  }
  submitPartnerProfile(applicationBody: any): Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/SubmitPartnerProfile', applicationBody);
    }

  getPartnersProfile(email: string, company: string): Observable<Profile>{
    return this.httpClient.get<Profile>(this.baseUrl+'PartnerProfile/profile?email='+email +'&company='+company);
  }

  getAreaOfFocus(company: string): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl+'OData/areas-of-focus?company='+company);
  }


  getGeoLocation(company: string): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl+'OData/countries?company='+company);
  }

   getContactType(company: string): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl+'OData/partner-contact-types?company='+company);
  }

  getContactsPersonByDocumentNo( company: string, documentNo: string,): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ company + '/'+ documentNo +'/contacts');
  }

  getContactPersonLine(company: string,documentNo: string, lineNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ company + '/'+ documentNo +'/contacts/'+lineNo);
  }

  getAreasOfFocusByDocumentNo(company: string,documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+company + '/'+documentNo +'/focus-areas');
  }

  getAreasOfFocusLine(company: string, documentNo: string, lineNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ company + '/'+ documentNo +'/focus-areas/'+lineNo);
  }

  getGeoCoverageByDocumentNo(company: string, documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ company + '/'+ documentNo +'/geo-coverage');
  }

  getGeoCoverageLine(company: string, documentNo: string, lineNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ company + '/'+ documentNo +'/coverage-areas/'+lineNo);
  }

  getPatnerExperience(company: string, documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ company + '/'+ documentNo +'/prog-exp');
  }

  getUploadedPortalAttachments(company: string, documentNo: string): Observable<Profile>{
    return this.httpClient.get<Profile>(this.baseUrl+'Document/GetUploadedPortalAttachments?company='+company +'&documentNo='+documentNo);
  }

  getGoverningBodies(company: string): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl+'OData/partner-governing-bodies?company='+company);
  }

}
