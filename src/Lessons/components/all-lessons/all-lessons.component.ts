import { Component, OnInit } from '@angular/core';
import { Lesson } from '../../../models/lesson';
import { LessonService } from '../services/lesson.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../Authentication/services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-lessons',
  standalone: true,
  imports: [MatCardModule,
    MatGridListModule,
    MatIconModule, RouterOutlet],
  templateUrl: './all-lessons.component.html',
  styleUrl: './all-lessons.component.css'
})
export class AllLessonsComponent implements OnInit {

  editLesson(lesson: Lesson) {
    this.router.navigate([`${this.router.url}/edit/${lesson.id}`]);
  }
  deleteLesson(lesson: Lesson) {
    this.lessonservice.deleteLesson(lesson.id)
      .subscribe(() => {
        this.lessons.next(this.lessons.getValue().filter(c => c.id !== lesson.id));
      },
        error => this.errorMessage = error);
  }

  addLesson() {
    this.router.navigate([`${this.router.url}/add`]);
  }
  lessons: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>([]);
  courseId: number = 0;
  errorMessage: string = '';

  constructor(private lessonservice: LessonService,
    private router: Router,
    public authService: AuthenticationService, private route: ActivatedRoute
  ) {
    this.lessonservice.lessons$.subscribe((data: Lesson[]) => {
      this.lessons.next(data);
    });

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      this.lessonservice.getAllLessons().subscribe((data: Lesson[]) => {
        this.lessons.next(data);
      })
    });

  }


}
