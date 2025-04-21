import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-Chatbot',
  templateUrl: './Chatbot.page.html',
  styleUrls: ['./Chatbot.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class ChatbotPage implements OnInit {


  constructor() { }

  ngOnInit() {
  }

}
