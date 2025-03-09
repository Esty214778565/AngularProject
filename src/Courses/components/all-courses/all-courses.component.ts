import { Component, SimpleChanges } from '@angular/core';
import { Course } from '../../../models/course';
import { CourseService } from '../services/course.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../Authentication/services/authentication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [MatCardModule, RouterOutlet,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './all-courses.component.html',
  styleUrl: './all-courses.component.css'
})
export class AllCoursesComponent {

  courseId: string = ''
  courses: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  connectedCourses: Course[] = [];
  errorMessage: string = '';
  constructor(
    private courseService: CourseService,
    public authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    console.log("in oninit all courses");

    // Subscribe to route parameter changes
    this.courseId = this.router.url.split('/').slice(2, 3).join('/');
    this.loadCurrentUserCourses(this.courseId); // Call a method to load lessons based on the new ID

  }
  loadCurrentUserCourses(id: string): void {
    this.courseService.getCoursesByStudentId(this.authService.currentUserId as number).subscribe((courses: Course[]) => {
      this.connectedCourses = courses;

      this.courseService.courses$.subscribe((data: Course[]) => {
        this.courses.next(data);
      });
    });
    this.courseService.getAllCourses().subscribe();
  }
  isCourseConnected(course: Course): boolean {

    if (this.connectedCourses && this.connectedCourses.find(c => c.id == course.id))
      return true;
    return false;
  }
  showDetails(course: Course) {
    this.router.navigate([`courses/${course.id}/lessons`]);
  }

  joinCourse(course: Course) {
    this.courseService.addStudentToCourse(course.id, this.authService.currentUserId as number).subscribe(() => {
      this.courseService.getCoursesByStudentId(this.authService.currentUserId as number).subscribe((courses: Course[]) => {
        this.connectedCourses = courses;
      });
    }
    );
  }
  leaveCourse(course: Course) {
    this.courseService.leaveCourse(course.id, this.authService.currentUserId as number).subscribe(() => {
      this.courseService.getCoursesByStudentId(this.authService.currentUserId as number).subscribe((courses: Course[]) => {
        this.connectedCourses = courses;
      });
    }
    );
  }

  editCourse(course: Course) {
    this.router.navigate([`courses/edit/${course.id}`]);
  }

  deleteCourse(course: Course) {
    this.courseService.deleteCourse(course.id)
      .subscribe(() => {
        this.courses.next(this.courses.getValue().filter(c => c.id !== course.id));
      },
        error => this.errorMessage = error);
  }

  addCourse() {

    this.router.navigate(['courses/add']);
  }



}
