import { Component, NgModule } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';
import { User } from '../../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.css'
})
export class SignUpDialogComponent {

  user: User = {
    name: '',
    email: '',
    password: '',
    id: 0,
    role: "student"
  };
  role: boolean = false
  constructor(private authService: AuthenticationService, private router: Router) {
  }

  onChange() {
    if (this.user.role === "student") {
      this.user.role = "teacher";
      this.role = true
    }
    else {
      this.user.role = "student";
      this.role = false;

    }

  }
  signUp() {

    this.authService.register(this.user).subscribe(result => {

      sessionStorage.setItem('token', result.token);
      this.authService.isConnected = true;
      this.authService.currentUserId = result.userId
      if (this.user.role == "teacher") {
        this.authService.isTeacher = true;
      }
      this.router.navigate(['courses']);
    });
  }
  close() {
    this.router.navigate(['']);
  }
}
