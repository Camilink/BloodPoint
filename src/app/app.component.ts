<<<<<<< HEAD
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
>>>>>>> origin/zChao

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

<<<<<<< HEAD
    const isOnLogin = this.router.url.includes('/login');
    const isOnHome = this.router.url.includes('/menu');

    if (token && !isOnHome) {
      this.router.navigate(['/menu/index']);
    } else if (!token && !isOnLogin) {
      this.router.navigate(['/login']);
    }
  }
}
=======
    const isOnLogin = this.router.url.includes('/tab0');
    const isOnHome = this.router.url.includes('/tabs');

    if (token && !isOnHome) {
      this.router.navigate(['/tabs/tab1']);
    } else if (!token && !isOnLogin) {
      this.router.navigate(['/tab0']);
    }
  }
}
>>>>>>> origin/zChao
