import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  get(url: string) {
    return this.http.get<any>(this.baseUrl + url);
  }

  post(url: string, obj?: any) {
    return this.http.post<any>(this.baseUrl + url, obj);
  }

  put(url: string, obj: any) {
    return this.http.put<any>(this.baseUrl + url, obj);
  }

  patch(url: string, obj: any) {
    return this.http.patch<any>(this.baseUrl + url, obj);
  }

  delete(url: string) {
    return this.http.delete<any>(this.baseUrl + url);
  }
}
