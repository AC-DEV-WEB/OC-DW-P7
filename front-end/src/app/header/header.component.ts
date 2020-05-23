import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menu = false;

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  // appel la méthode de déconnexion de l'utilisateur
  onLogout() {
    this.auth.logout();
  }

  // active/désactive le menu de la barre de navigation en mode responsive
  public toggleMenu() {
    this.menu = !this.menu;
  }

}
