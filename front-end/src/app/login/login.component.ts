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

  public loginForm: FormGroup;
  public loading: boolean;
  public errorMsg: string;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    // on redirige l'utilisateur vers la page du forum si celui-ci est déjà authentifié
    if (this.auth.loggedIn()) {
      this.router.navigate(['/forum']);
    } else {
      this.router.navigate(['/login']);
    };

    // on initialise les données du formulaire de connexion d'un utilisateur existant
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // on traite la réponse du serveur pour la connexion d'un utilisateur existant
  onLogin() {
    this.loading = true;
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
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
}