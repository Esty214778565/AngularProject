// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Lesson } from '../../../models/lesson';
// import { ActivatedRoute } from '@angular/router';


// @Injectable({
//   providedIn: 'root'
// })
// export class LessonService {
//   courseId!: number;
//   private apiUrl = `http://localhost:3000/api/courses/${this.courseId}/lessons`;
//   constructor(private http: HttpClient, private route: ActivatedRoute) {
//     this.route.params.subscribe(params => {
//       this.courseId = +params['id'];

//       console.log("id in lesson service: " + params['id']);


//     })
//   };


//   private getHeaders(): HttpHeaders {
//     const token = sessionStorage.getItem('token');
//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     });
//   }

//   getAllLessons(): Observable<Lesson[]> {
//     return this.http.get<Lesson[]>(this.apiUrl, { headers: this.getHeaders() });
//   }

//   getLessonById(id: number): Observable<Lesson> {
//     return this.http.get<Lesson>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
//   }

//   createLesson(Lesson: Lesson): Observable<Lesson> {
//     return this.http.post<Lesson>(this.apiUrl, Lesson, { headers: this.getHeaders() });
//   }
// }
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Lesson } from '../../../models/lesson';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  courseId!: number;
  private apiUrl = `http://localhost:3000/api/courses/${this.courseId}/lessons`;
  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);
  lessons$ = this.lessonsSubject.asObservable();

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllLessons(): Observable<Lesson[]> {
    debugger;
    const url = this.router.url.split('/').slice(2, 3).join('/');
    this.courseId = +url
    this.apiUrl = `http://localhost:3000/api/courses/${this.courseId}/lessons`;
    return this.http.get<Lesson[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(lessons => this.lessonsSubject.next(lessons))
    );
  }

  getLessonById(id: number): Observable<Lesson> {
    const url = this.router.url.split('/').slice(2, 3).join('/');
    this.courseId = +url
    this.apiUrl = `http://localhost:3000/api/courses/${this.courseId}/lessons`;
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createLesson(lesson: Lesson): Observable<Lesson> {
    const url = this.router.url.split('/').slice(2, 3).join('/');
    this.courseId = +url
    this.apiUrl = `http://localhost:3000/api/courses/${this.courseId}/lessons`;
    return this.http.post<Lesson>(this.apiUrl, lesson, { headers: this.getHeaders() }).pipe(
      tap(newLesson => {
        const currentLessons = this.lessonsSubject.value;
        this.lessonsSubject.next([...currentLessons, newLesson]);
      })
    );
  }

  updateLesson(id: number, lesson: Lesson): Observable<Lesson> {
    const url = this.router.url.split('/').slice(2, 3).join('/');
    this.courseId = +url
    this.apiUrl = `http://localhost:3000/api/courses/${this.courseId}/lessons`;
    return this.http.put<Lesson>(`${this.apiUrl}/${id}`, lesson, { headers: this.getHeaders() }).pipe(
      tap(updatedLesson => {
        const currentLessons = this.lessonsSubject.value;
        const updatedLessons = currentLessons.map(l => l.id === id ? updatedLesson : l);
        this.lessonsSubject.next(updatedLessons);
      })
    );
  }

  deleteLesson(id: number): Observable<any> {
    const url = this.router.url.split('/').slice(2, 3).join('/');
    this.courseId = +url
    this.apiUrl = `http://localhost:3000/api/courses/${this.courseId}/lessons`;
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        const currentLessons = this.lessonsSubject.value;
        const updatedLessons = currentLessons.filter(l => l.id !== id);
        this.lessonsSubject.next(updatedLessons);
      })
    );
  }
}