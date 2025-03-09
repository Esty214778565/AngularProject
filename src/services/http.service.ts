// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { User } from '../models/user';
// import { Course } from '../models/course';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpService {
//   private apiUrl = 'http://localhost:3000/api';
//   public current: User | Course | null = null;
//   constructor(private http: HttpClient) { }


//   getData(typeObject: 'users' | 'courses') {
    
//     return this.http.get<User[] | Course[]>(`${this.apiUrl}/${typeObject}`)
//   }
//   getDataById(id: string, typeObject: 'users' | 'courses') {

//     return this.http.get<User | Course>(`${this.apiUrl}/${typeObject}/:${id}`)
//   }

//   createData(object: User | Course, type: 'users' | 'courses') {
//     this.current = object
//     return this.http.post<User | Course>(`${this.apiUrl}/auth/register `, object)
//   }
//   updateData(id: string, objectType: 'users' | 'courses', object: User | Course) {
//     this.current = object;
//     return this.http.put<User | Course>(`${this.apiUrl}/${objectType}/:${id}`, object)
//   }
//   deleteData(id: string, objectType: 'users' | 'courses') {
//     return this.http.delete<void>(`${this.apiUrl}/${objectType}/:${id}`)
//   }
// }

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { User } from '../models/user';
import { Course } from '../models/course';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'http://localhost:3000/api';
  public current: User | Course | null = null;

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error.message}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  getData(typeObject: 'users' | 'courses'): Observable<User[] | Course[]> {
    return this.http.get<User[] | Course[]>(`${this.apiUrl}/${typeObject}`, { headers: this.getHeaders() }).pipe(
      tap(data => {
        if (typeObject === 'users') {
          this.usersSubject.next(data as User[]);
        } else {
          this.coursesSubject.next(data as Course[]);
        }
      }),
      catchError(this.handleError)
    );
  }

  getDataById(id: string, typeObject: 'users' | 'courses'): Observable<User | Course> {
    return this.http.get<User | Course>(`${this.apiUrl}/${typeObject}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createData(object: User | Course, type: 'users' | 'courses'): Observable<User | Course> {
    this.current = object;
    return this.http.post<User | Course>(`${this.apiUrl}/auth/register`, object, { headers: this.getHeaders() }).pipe(
      tap(newObject => {
        if (type === 'users') {
          const currentUsers = this.usersSubject.value;
          this.usersSubject.next([...currentUsers, newObject as User]);
        } else {
          const currentCourses = this.coursesSubject.value;
          this.coursesSubject.next([...currentCourses, newObject as Course]);
        }
      }),
      catchError(this.handleError)
    );
  }

  updateData(id: string, objectType: 'users' | 'courses', object: User | Course): Observable<User | Course> {
    this.current = object;
    return this.http.put<User | Course>(`${this.apiUrl}/${objectType}/${id}`, object, { headers: this.getHeaders() }).pipe(
      tap(updatedObject => {
        if (objectType === 'users') {
          const currentUsers = this.usersSubject.value;
          const updatedUsers = currentUsers.map(u => 
            u.id ===+id ? updatedObject as User : u);
          this.usersSubject.next(updatedUsers);
        } else {
          const currentCourses = this.coursesSubject.value;
          const updatedCourses = currentCourses.map(c => c.id === +id ? updatedObject as Course : c);
          this.coursesSubject.next(updatedCourses);
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteData(id: string, objectType: 'users' | 'courses'): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${objectType}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        if (objectType === 'users') {
          const currentUsers = this.usersSubject.value;
          const updatedUsers = currentUsers.filter(u => u.id !== +id);
          this.usersSubject.next(updatedUsers);
        } else {
          const currentCourses = this.coursesSubject.value;
          const updatedCourses = currentCourses.filter(c => c.id !== +id);
          this.coursesSubject.next(updatedCourses);
        }
      }),
      catchError(this.handleError)
    );
  }
}
