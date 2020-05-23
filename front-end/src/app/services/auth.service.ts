import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userId: string;
  private authToken: string;

  constructor(private http: HttpClient, private router: Router) { }

  // renvoie le token d'authentification de l'utilisateur
  public getToken() {
    return localStorage.getItem('token');
  }

  // renvoie le numéro d'identification de l'utilisateur
  public getUserId() {
    return this.userId;
  }

  // contrôle la présence du token d'authentification
  public loggedIn() {
    return !!localStorage.getItem('token');
  }

  // envoie une requête d'enregistrement d'un nouvel utilisateur
  public register(firstName: string, lastName: string, email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/auth/register', {firstName: firstName, lastName: lastName, email: email, password: password}).subscribe(
        (res: { message: string }) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // envoie une requête de connexion pour un utilisateur existant
  public login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/auth/login', {email: email, password: password}).subscribe(
        (res: {userId: string, token: string}) => {
          this.userId = res.userId;
          this.authToken = res.token;
          
          // on stock le token d'authentification dans le localStorage
          localStorage.setItem('token', res.token);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // déconnecte l'utilisateur
  public logout() {
    // supprime le token d'authentification du localStorage
    localStorage.removeItem('token');

    // redirige l'utilisateur vers la page de connexion
    this.router.navigate(['/login']);
  }
}
