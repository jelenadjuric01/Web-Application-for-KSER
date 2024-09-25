import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  uri = 'http://localhost:4000/country'

  constructor(private http: HttpClient) { }

  fetchByNameService(name) {
    const data = {
      name: name,
    }
    return this.http.post(`${this.uri}/fetchByName`, data);
  }

  fetchAll() {

    return this.http.get(`${this.uri}/fetchAll`);
  }

}
