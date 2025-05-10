import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Ayudabp',
  templateUrl: './Ayudabp.page.html',
  styleUrls: ['./Ayudabp.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, FormsModule, CommonModule]
})
export class AyudabpPage implements OnInit {

  newMessage: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userText = this.newMessage;
    this.messages.push({ text: userText, sender: 'user' });
    this.newMessage = '';

    this.http.post<{ validacion: string; response: string }>('http://localhost:8000/ask/', {
      prompt: userText
    }).subscribe({
      next: (res) => {
        let respuesta = res.response;

        if (res.validacion === 'no') {
          respuesta = '❌ ' + respuesta;
        } else if (res.validacion === 'no sé') {
          respuesta = '🤔 ' + respuesta;
        }

        this.messages.push({ text: respuesta, sender: 'bot' });
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ text: 'Error al conectar con el servidor.', sender: 'bot' });
      }
    });

    this.scrollToBottom();
  }

  scrollToBottom() {
    const el = document.getElementById('chat-content');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
