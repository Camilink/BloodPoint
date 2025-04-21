import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss'],
  standalone: false,
})
export class IndexPage implements OnInit {

  donantes: any[] = [];

  constructor(private ApiService: ApiService) {}

  ngOnInit() {
    this.cargarDonantes();
  }

  cargarDonantes() {
    this.ApiService.getDonantes().subscribe(data => {
      this.donantes = data;
    });
  }
}
