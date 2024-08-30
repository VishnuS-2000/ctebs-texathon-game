import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, catchError, map, throwError } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class ApiService{
    apiUrl = environment.apiUrl;

    constructor(private http:HttpClient){
        
    }
    
  get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, { params }).pipe(
      map((res: any) => {
        if (res && res.error) {
          throw new Error(res.error.message || 'An unknown error occurred');
        }
        return res;
      }),
      catchError(this.handleError)
    );
  }

  post(
    path: string,
    body: Object = {},
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, body, { params }).pipe(
      map((res: any) => {
        if (res && res.error) {
          throw new Error(res.error.message || 'An unknown error occurred');
        }
        return res;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

}