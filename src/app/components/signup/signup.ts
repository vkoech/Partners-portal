import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

  SignUpForm: FormGroup;

  constructor(private fb: FormBuilder){
     this.SignUpForm = this.fb.group({
        email: ['', Validators.required],
        registrationNumber: ['', Validators.required],
        organizationName: ['', Validators.required]
      })
     }


  goToLogin(event?: Event){

  }

  onSignup(){}

}
