import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  uri = 'http://localhost:4000/package'

  constructor(private http: HttpClient) { }

  updatePackage(number,status) {
    const data = {
      number: number,
      status: status
    }
    return this.http.post(`${this.uri}/updatePackage`, data);
  }

  fetchAll() {

    return this.http.get(`${this.uri}/fetchAll`);
  }
}
