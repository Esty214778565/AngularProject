import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { Course } from '../../../models/course';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { BehaviorSubject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule,CommonModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css'], // Corrected from styleUrl to styleUrls
  animations: [ // Define the animations here
    trigger('transitionMessages', [
      transition(':enter', [
        style({ opacity: 0 }), // Initial state
        animate('300ms', style({ opacity: 1 })) // Final state
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })) // Fade out
      ])
    ])
  ]
 })


export class CourseFormComponent {
  isAdd: boolean = false
  course: Course = new Course(0, '', '', 2, [])
  courseId: number = 0;
  courseForm: FormGroup;
  private courseSubject = new BehaviorSubject<any>({ title: '', description: '' });

  constructor(private fb: FormBuilder,
     private route: ActivatedRoute,
      private courseService: CourseService,
      private router:Router) {
    console.log("enter ctor corse form");
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      if (!Number.isNaN(this.courseId)) {

        this.courseService.getCourseById(this.courseId).subscribe((data: Course) => {
          this.course = data;
          this.fillForm(this.course);
        });
      }
      else {
        this.isAdd = true;
      }
    });
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],

    });
  }
  fillForm(data: any): void {
    Object.keys(data).forEach(key => {
      if (this.courseForm.controls[key]) {
        this.courseForm.controls[key].setValue(data[key]);
      }
    });
  }
  ngOnInit(): void {
    this.courseSubject.subscribe(course => {
      this.courseForm.patchValue(course);
    });

    this.courseForm.valueChanges.subscribe(value => {
      this.courseSubject.next(value);
    });
  }

  onSubmit(): void {
    this.course.title = this.courseForm.value.title;
    this.course.description = this.courseForm.value.description;
    if (this.isAdd) {
      this.courseService.createCourse(this.course).subscribe((data: Course) => {
        this.course = data;
        this.courseService.getAllCourses().subscribe();
      });
    }
    else {
      this.courseService.updateCourse(this.courseId, this.course).subscribe((data: Course) => {
        this.course = data;
        this.courseService.getAllCourses().subscribe();

      });

    }
    this.closeModal()
  }
  closeModal() {
    this.router.navigate(['courses']);
  }
}
