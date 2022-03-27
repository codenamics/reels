import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  inSubmission = false;
  showAlert = false;
  alertMsg = '';
  alertColor = '';
  credentials = {
    email: '',
    password: '',
  };
  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async login() {
    this.inSubmission = true;
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      console.log(error);
      this.showAlert = true;
      this.alertMsg = 'An unexpected error occurred';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.inSubmission = false;
    this.showAlert = true;
    this.alertMsg = 'Success!';
    this.alertColor = 'green';
  }
}
