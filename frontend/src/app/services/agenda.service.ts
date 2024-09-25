import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agenda } from '../models/agenda';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  uri = 'http://localhost:4000/agenda'

  constructor(private http: HttpClient) { }

  updateAgenda(agenda:Agenda) {
    const data = {
      day: agenda.day,
      items: agenda.items
    }
    return this.http.post(`${this.uri}/updateAgenda`, data);
  }

  fetchAll() {

    return this.http.get(`${this.uri}/fetchAll`);
  }
}
