import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) { 
    
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    this.auth.login(this.loginForm.get('email').value,
      this.loginForm.get('password').value)
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