import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:3000/api';
  public currentUserId: number | null = null;

  isConnected: boolean = false;
  isTeacher: boolean = false;

  constructor(private http: HttpClient) { }


  register(user: User): Observable<any> {
    console.log(user.role);
    
    this.currentUserId = user.id
    console.log("enter authentication service register");
    console.log(user);
    console.log(`${this.apiUrl}/auth/register`);
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
 
    console.log("in auth service login");
    console.log(`${this.apiUrl}/auth/login`);
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);

  }
}
