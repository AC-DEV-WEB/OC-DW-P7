import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuth = false;

  constructor() { }

  public getAuth() {
    return this.isAuth;
  }

  public register(fisrtName: string, lastName: string, email: string, password: string) {
    // requête pour créer un compte
  }

  public login(email: string, password: string) {
    // requête pour se connecter
  }
}
