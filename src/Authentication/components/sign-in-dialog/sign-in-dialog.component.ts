import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-sign-in-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule],
  templateUrl: './sign-in-dialog.component.html',
  styleUrl: './sign-in-dialog.component.css'
})
export class SignInDialogComponent {

  credentials = { email: '', password: '' };


  constructor(private authService: AuthenticationService, private router: Router, private userService: UserService) { }

  signIn() {
    this.authService.login(this.credentials).subscribe(result => {
      sessionStorage.setItem('token', result.token);
      this.authService.isConnected = true;
      this.authService.currentUserId = result.userId

      const user = this.userService.getUserById(result.userId);
      this.authService.isTeacher = result.role == "teacher" ? true : false;

      this.router.navigate(['courses']);
    });
  }
  close() {
    this.router.navigate(['']);
  }
}




