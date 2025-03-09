// import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { BehaviorSubject, Observable } from "rxjs";
// import { Course } from "../../../models/course";


// @Injectable({
//   providedIn: 'root'
// })
// export class CourseService {
//   private apiUrl = 'http://localhost:3000/api/courses';

//   constructor(private http: HttpClient) { }

//   private getHeaders(): HttpHeaders {
//     const token = sessionStorage.getItem('token');
//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     });
//   }


//   getAllCourses(): Observable<Course[]> {
//     return this.http.get<Course[]>(this.apiUrl, { headers: this.getHeaders() });
//   }

//   getCourseById(id: number): Observable<Course> {
//     return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
//   }

//   createCourse(course: Course): Observable<Course> {
//     return this.http.post<Course>(this.apiUrl, course, { headers: this.getHeaders() });
//   }

//   updateCourse(id: number, course: Course): Observable<Course> {
//     return this.http.put<Course>(`${this.apiUrl}/${id}`, course, { headers: this.getHeaders() });
//   }

//   deleteCourse(id: number): Observable<any> {
//     debugger
//     return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
//   }
//   addStudentToCourse(courseId: number, userId: number): Observable<Course> {
//     debugger;
//     return this.http.post<Course>(`${this.apiUrl}/${courseId}/enroll`, { userId }, { headers: this.getHeaders() });
//   }
//   leaveCourse(courseId: number, userId: number): Observable<Course> {
//     const body = { userId };
//     return this.http.delete<Course>(`${this.apiUrl}/${courseId}/unenroll`, { body, headers: this.getHeaders() });
//   }
// }

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Course } from "../../../models/course";
import { switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses';
  private coursesSubject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log("enter ctor course service");
  }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(courses => this.coursesSubject.next(courses))
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  getCoursesByStudentId(userId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/student/${userId}`, { headers: this.getHeaders() });
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course, { headers: this.getHeaders() })

  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course, { headers: this.getHeaders() });

  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(tap(() => this.getAllCourses()));//check if good
  }


  addStudentToCourse(courseId: number, userId: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${courseId}/enroll`, { userId }, { headers: this.getHeaders() }
    )
  }

  leaveCourse(courseId: number, userId: number): Observable<Course> {
    const body = { userId }
    return this.http.delete<Course>(`${this.apiUrl}/${courseId}/unenroll`, { body, headers: this.getHeaders() })

  }
}
