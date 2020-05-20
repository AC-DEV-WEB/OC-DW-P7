import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menu = false;
  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  public toggleMenu() {
    this.menu = !this.menu;
  }

}
