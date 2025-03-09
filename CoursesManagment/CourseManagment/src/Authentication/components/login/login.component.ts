
import { Component } from '@angular/core';
import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { SignUpDialogComponent } from '../sign-up-dialog/sign-up-dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, SignInDialogComponent, SignUpDialogComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  // styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private routertry:Router) {
    console.log("enter login component constructor");
 
  }
  isSignIn:boolean = false;
  isSignUp:boolean = false;
  openSignInDialog() {
    this.isSignIn = true;
  }

  openSignUpDialog() {
    
    this.isSignUp=true;
  }


}


// import { Component, Input } from '@angular/core';
// import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';
// import { MatDialog } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';
// import { SignUpDialogComponent } from '../sign-up-dialog/sign-up-dialog.component';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [MatButtonModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
//   // styleUrl: './login.component.css'
// })
// export class LoginComponent {
//   constructor(private dialog: MatDialog) {
//     console.log("enter login component constructor");
//   }
//   isLogin:boolean = false;
//   openSignInDialog() {
//     this.dialog.open(SignInDialogComponent);
//   }

//   openSignUpDialog() {
//     console.log("enter function sign up");
//     debugger;
//     this.dialog.open(SignUpDialogComponent);
//   }


// }