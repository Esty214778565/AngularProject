import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Lesson } from '../../../models/lesson';
import { LessonService } from '../services/lesson.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  templateUrl: './lesson-form.component.html',
  styleUrl: './lesson-form.component.css'
})
export class LessonFormComponent {

  isAdd: boolean = false
  lesson: Lesson = new Lesson(0, '', '', 0)
  lessonId: number = 0;
  lessonForm: FormGroup;
  private courseId: number = 0
  private lessonSubject = new BehaviorSubject<any>({ title: '', content: '' });

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.lessonId = +params['lesson-id'];

      if (!Number.isNaN(this.lessonId)) {

        this.lessonService.getLessonById(this.lessonId).subscribe((data: Lesson) => {
          this.lesson = data;
          this.fillForm(this.lesson);
        });
      }
      else {
        this.isAdd = true;
      }
    });
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],

    });
  }
  fillForm(data: any): void {
    Object.keys(data).forEach(key => {
      if (this.lessonForm.controls[key]) {
        this.lessonForm.controls[key].setValue(data[key]);
      }
    });
  }
  ngOnInit(): void {
    this.lessonSubject.subscribe(lesson => {
      this.lessonForm.patchValue(lesson);
    });

    this.lessonForm.valueChanges.subscribe(value => {
      this.lessonSubject.next(value);
    });
    const url = this.router.url.split('/').slice(2, 3).join('/');
    this.courseId = +url;

  }

  onSubmit(): void {

    this.lesson.title = this.lessonForm.value.title;
    this.lesson.content = this.lessonForm.value.content;
    if (this.isAdd) {
      this.lessonService.createLesson(this.lesson).subscribe((data: Lesson) => {
        this.lesson = data;
        this.lessonService.getAllLessons().subscribe();
      });
    }
    else {
      this.lessonService.updateLesson(this.lessonId, this.lesson).subscribe((data: Lesson) => {
        this.lesson = data;
        this.lessonService.getAllLessons().subscribe();

      });

    }
    this.closeModal()
  }
  closeModal() {

    this.router.navigate([`courses/${this.courseId}/lessons`]);
  }



}
