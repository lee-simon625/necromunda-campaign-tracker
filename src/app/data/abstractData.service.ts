import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export abstract class AbstractDataService<T> {

  constructor(
    private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  baseUrl : string = "https://86.12.177.19:4567/campaign" ;

  getAll(url: string): Observable<any> {
     return this.http.get(this.baseUrl+url)
      .pipe(catchError(this.handleError(`get all ${this.baseUrl}`, "")))
       
  }

  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl+url)
      .pipe(catchError(this.handleError<T>(`get ${url}`)))
  }

  create(url: string, obj: T): Observable<T> {
    return this.http.post<T>(url, obj, this.httpOptions)
      .pipe(catchError(this.handleError<T>(`create ${url}`)))
  }

  delete(url: string): Observable<T> {
    return this.http.delete<T>(url, this.httpOptions)
      .pipe(catchError(this.handleError<T>(`delete ${url}`)))
  }

  update(url: string, obj: T): Observable<T> {
    return this.http.put<T>(url, obj, this.httpOptions)
      .pipe(catchError(this.handleError<T>(`put ${url}`)))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  // protected urlPrefix(): string {
  //   return `campaign/${SelectedCampaignService.getCampaignId()}/`
  // }
}

