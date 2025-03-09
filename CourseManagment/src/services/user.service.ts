import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { HttpService } from './http.service';
import { Course } from '../models/course';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';  
  private currentUser: User | null = null;
  constructor(private http: HttpClient, private httpService: HttpService) { }


  getUsers(): Observable<User[]|Course[]> {
    return this.httpService.getData("users");
  }
  getUserById(userId: string): Observable<User | Course> {
    return this.httpService.getDataById(userId, 'users');
  }
  updateUser(userId: string, user: User): Observable<User|Course> {
    return this.httpService.updateData(userId, 'users', user);
  }

  deleteUser(userId: string): Observable<void> {
    return this.httpService.deleteData(userId, 'users');
  }
}



