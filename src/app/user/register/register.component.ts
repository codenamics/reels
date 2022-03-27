import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicies/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  inSubmission = false;
  constructor(private authService: AuthService) {}
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.maxLength(13),
    Validators.minLength(13),
  ]);
  showAlert = false;
  alertMsg = 'Please wait account is being created';
  alertColor = 'blue';
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  });
  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.authService.createUser(this.registerForm.value);
    } catch (error) {
      console.log(error);
      this.alertMsg = 'An unexpected error occurred';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.alertMsg = 'Success! You account has been created.';
    this.alertColor = 'green';
  }
}
