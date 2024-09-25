import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  uri = 'http://localhost:4000/notifications'

  constructor(private http: HttpClient) { }

  addNot(title, description) {
    const data = {
      title: title,
      description: description
    }
    return this.http.post(`${this.uri}/addNot`, data);
  }

  deleteNot( _id) {
    const data = {
      _id: _id
    }
    return this.http.post(`${this.uri}/deleteNot`, data);
  }
  updateNot(_id, title, description, read) {
    const data = {
      _id: _id,
      title: title,
      description: description,
      read: read
    }
    return this.http.post(`${this.uri}/updateNot`, data);
  }
  fetchAll() {

    return this.http.get(`${this.uri}/fetchAll`);
  }
  fetchNot(_id) {
    const data = {
      _id: _id
    }
    return this.http.post(`${this.uri}/fetchNot`, data);
  }
}
