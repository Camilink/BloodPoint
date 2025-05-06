import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.checkSession();
  }

  checkSession() {
    const token = localStorage.getItem('authToken');

    const isOnLogin = this.router.url.includes('/tab0');
    const isOnHome = this.router.url.includes('/tabs');

    if (token && !isOnHome) {
      this.router.navigate(['/tabs/tab1']);
    } else if (!token && !isOnLogin) {
      this.router.navigate(['/tab0']);
    }
  }
}
