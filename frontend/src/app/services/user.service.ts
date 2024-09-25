import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:4000/users'

  constructor(private http: HttpClient) { }

  fetchByUsernameService(username) {
    const data = {
      username: username,
    }
    return this.http.post(`${this.uri}/fetchByUsername`, data);
  }

  fetchByTypeService(type) {
    const data = {
      type: type
    }
    return this.http.post(`${this.uri}/fetchByType`, data);
  }
  fetchByEmailService(email) {
    const data = {
      email: email
    }
    return this.http.post(`${this.uri}/fetchByEmail`, data);
  }
  fetchByTypeAndCountryService(type, country) {
    const data = {
      type: type,
      country: country,
    }
    return this.http.post(`${this.uri}/fetchByTypeAndCountry`, data);
  }

  addUserService( password, firstname, lastname,faculty, country, email, type,department,index,year,phone,accepted) {

    const data = {
      password: password,
      firstname: firstname,
      lastname: lastname,
      country: country,
      email: email,
      type: type,
      faculty: faculty,
      department: department,
      index: index,
      year: year,
      phone: phone,
      accepted: accepted
    }



    return this.http.post(`${this.uri}/addUser`, data);
  }

  updateUser( password, firstname, lastname,faculty, country, email,department,index,year,phone) {

    const data = {
      password: password,
      firstname: firstname,
      lastname: lastname,
      country: country,
      email: email,
      faculty: faculty,
      department: department,
      index: index,
      year: year,
      phone: phone,
    }



    return this.http.post(`${this.uri}/updateUser`, data);
  }

  changePasswordByUsernameService(username, newPassword) {
    const data = {
      username: username,
      newPassword: newPassword,
    }

    return this.http.post(`${this.uri}/changePasswordByUsername`, data);

  }

  sendPassword(email, password) {
    const data = {
      email: email,
      password: password
    }

    return this.http.post(`${this.uri}/sendPassword`, data);

  }

  sendNotifications(emails, text,subject) {
    const data = {
      emails: emails,
      text: text,
      subject: subject
    }

    return this.http.post(`${this.uri}/sendNotifications`, data);

  }

  fetchUnacceptedUsersService() {
    return this.http.get(`${this.uri}/fetchUnacceptedUsers`);
  }

  fetchAll() {
    return this.http.get(`${this.uri}/fetchAll`);
  }
  deleteUser(user) {
    const data = {
      email: user.email
    }

    return this.http.post(`${this.uri}/deleteUser`, data);

  }

  changeType(email,type) {
    const data = {
      email: email,
      type: type
    }

    return this.http.post(`${this.uri}/changeType`, data);

  }
  acceptUserService(email) {
    const data = {
      email: email
    }

    return this.http.post(`${this.uri}/acceptUser`, data);

  }

  addRoommates(email,roommates,status,packageP) {
    const data = {
      email: email,
      roommates: roommates,
      status: status,
      package: packageP
    }

    return this.http.post(`${this.uri}/addRoommates`, data);

  }
}
