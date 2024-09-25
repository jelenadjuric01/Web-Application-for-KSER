import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  uri = 'http://localhost:4000/map'

  constructor(private http: HttpClient) { }

  addMark(longitude, latitude, label) {
    const data = {
      longitude: longitude,
      label: label,
      latitude: latitude
    }
    return this.http.post(`${this.uri}/addMark`, data);
  }

  deleteMark( label) {
    const data = {
      label: label
    }
    return this.http.post(`${this.uri}/deleteMark`, data);
  }

  fetchAll() {

    return this.http.get(`${this.uri}/fetchAll`);
  }
}
