import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  uri = 'http://localhost:4000/registration'

  constructor(private http: HttpClient) { }

  setOrganizers(status) {
    const data = {
      status: status
    }
    return this.http.post(`${this.uri}/setOrg`, data);
  }

  setParticipants(status) {
    const data = {
      status: status
    }
    return this.http.post(`${this.uri}/setPart`, data);
  }

  setForeings(status) {
    const data = {
      status: status
    }
    return this.http.post(`${this.uri}/setFor`, data);
  }

  fetchAll() {

    return this.http.get(`${this.uri}/fetchAll`);
  }
}
