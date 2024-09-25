import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  uri = 'http://localhost:4000/news'

  constructor(private http: HttpClient) { }

  addNews(title, description) {
    const data = {
      title: title,
      description: description
    }
    return this.http.post(`${this.uri}/addNews`, data);
  }

  deleteNews( _id) {
    const data = {
      _id: _id
    }
    return this.http.post(`${this.uri}/deleteNews`, data);
  }
  updateNews(_id, title, description) {
    const data = {
      _id: _id,
      title: title,
      description: description
    }
    return this.http.post(`${this.uri}/updateNews`, data);
  }
  fetchAll() {

    return this.http.get(`${this.uri}/fetchAll`);
  }
  fetchNews(_id) {
    const data = {
      _id: _id
    }
    return this.http.post(`${this.uri}/fetchNews`, data);
  }
}
