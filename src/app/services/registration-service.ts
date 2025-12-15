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

  getPartnerRegistrationMandatoryDocuments(): Observable<Profile>{
    return this.httpClient.get<Profile>(this.baseUrl+'Document/GetPartnerRegistrationMandatoryDocuments');
  }

  createGeoLocationInfo(applicationBody: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/geo-coverage', applicationBody);
  }
  submitPartnerProfile(applicationBody: any): Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + 'PartnerProfile/SubmitPartnerProfile', applicationBody);
    }

  getPartnersProfile(email: string): Observable<Profile>{
    return this.httpClient.get<Profile>(this.baseUrl+'PartnerProfile/profile?email='+email);
  }

  getAreaOfFocus(): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/areas-of-focus');
  }

 getGeoLocation(): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/countries');
  }
  getContactType(): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partner-contact-types');
  }

  getContactsPersonByDocumentNo(documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ documentNo +'/contacts');
  }

  getContactPersonLine(documentNo: string, lineNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ documentNo +'/contacts/'+lineNo);
  }

  getAreasOfFocusByDocumentNo(documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ documentNo +'/focus-areas');
  }

  getAreasOfFocusLine(documentNo: string, lineNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ documentNo +'/focus-areas/'+lineNo);
  }

  getGeoCoverageByDocumentNo(documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ documentNo +'/geo-coverage');
  }

  getGeoCoverageLine(documentNo: string, lineNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ documentNo +'/coverage-areas/'+lineNo);
  }

  getPatnerExperience(documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'OData/partners/'+ documentNo +'/prog-exp');
  }

  getUploadedPortalAttachments(documentNo: string): Observable<Array<any>>{
    return this.httpClient.get<Array<any>>(this.baseUrl+'Document/GetUploadedPortalAttachments/'+ documentNo);
  }

  getGoverningBodies(): Observable<any>{
   return this.httpClient.get<any>(this.baseUrl+'OData/partner-governing-bodies');
  }




}
