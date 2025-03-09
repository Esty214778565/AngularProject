import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Course } from '../../../models/course';
import { CourseService } from '../services/course.service';


@Component({
  selector: 'app-display-course',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './display-course.component.html',
  styleUrl: './display-course.component.css'
})
export class DisplayCourseComponent {

  courseId!: number;
  currentCourse!: Course;
  constructor(private route: Router, private route2: ActivatedRoute, private courseService: CourseService) {
    this.route2.params.subscribe(params => {
      this.courseId = +params['id'];
      this.courseService.getCourseById(this.courseId).subscribe((data: Course) => {
        this.currentCourse = data;
      })
    });
    this.route.navigate([`courses/${this.courseId}/lessons`]);
  }
}
