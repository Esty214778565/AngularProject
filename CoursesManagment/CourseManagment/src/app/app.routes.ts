import { RouterOutlet, Routes } from '@angular/router';
import { AllLessonsComponent } from '../Lessons/components/all-lessons/all-lessons.component';
import { DisplayCourseComponent } from '../Courses/components/display-course/display-course.component';
import { AllCoursesComponent } from '../Courses/components/all-courses/all-courses.component';
import { LoginComponent } from '../Authentication/components/login/login.component';
import { connectedGuard } from '../gaurds/connected.guard';
import { CourseFormComponent } from '../Courses/components/course-form/course-form.component';
import { teacherConnectedGuard } from '../gaurds/teacher-connected.guard';
import { LessonFormComponent } from '../Lessons/components/lesson-form/lesson-form.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'courses',
        component: AllCoursesComponent, canActivate: [connectedGuard],
        children: [
            {
                path: 'add', component: CourseFormComponent, canActivate: [teacherConnectedGuard]
            },
            {
                path: 'edit/:id', component: CourseFormComponent, canActivate: [teacherConnectedGuard]
            },
            {
                path: ':id/lessons', component: AllLessonsComponent, canActivate: [connectedGuard],
                children: [
                    { path: 'add', component: LessonFormComponent, canActivate: [teacherConnectedGuard] },
                    { path: 'edit/:lesson-id', component: LessonFormComponent, canActivate: [teacherConnectedGuard] }
                ]
            }
        ]
    }
];
