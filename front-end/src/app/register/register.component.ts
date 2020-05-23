import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PasswordValidator } from './password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading: boolean;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  // initialise les données du formulaire d'enregistrement d'un nouvel utilisateur
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required], 
    }, { validator: PasswordValidator });
  }

  // traite la réponse du serveur pour l'enregistrement d'un nouvel utilisateur
  onRegister() {
    this.loading = true;
    const firstName = this.registerForm.get('firstName').value;
    const lastName = this.registerForm.get('lastName').value;
    const email = this.registerForm.get('email').value;
    const password = this.registerForm.get('password').value;
    this.auth.register(firstName, lastName, email, password).then(
      (res: { message: string }) => {
        this.auth.login(email, password).then(
          () => {
            this.loading = false;
            this.router.navigate(['/forum']);
          }
        ).catch(
          (error) => {
            this.loading = false;
            this.errorMsg = error.error.error;
          }
        );
      }
    ).catch((error) => {
        this.loading = false;
        this.errorMsg = error.error.error;
    });
  }
}
