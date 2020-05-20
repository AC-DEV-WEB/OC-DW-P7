import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onRegister() {
    this.auth.register(this.registerForm.get('lastName').value,
      this.registerForm.get('firstName').value,
      this.registerForm.get('email').value,
      this.registerForm.get('password').value)
      // .then(
      //   () => {
      //     this.router.navigateByUrl('/forum');
      //   })
      // .catch(
      //   (error) => {
      //     this.errorMsg = error;
    // });
  }
}
