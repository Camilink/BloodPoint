import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabia',
  templateUrl: './tabia.page.html',
  styleUrls: ['./tabia.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule,FormsModule, CommonModule]
})

export class TabiaPage implements OnInit {
  newMessage: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [
    { text: '¡Hola! Soy chatblood. ¿En qué puedo ayudarte?', sender: 'bot' }
  ];

  ngOnInit() {}

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userText = this.newMessage;
    this.messages.push({ text: userText, sender: 'user' });
    this.newMessage = '';

    setTimeout(() => {
      const reply = this.generateBotReply(userText);
      this.messages.push({ text: reply, sender: 'bot' });
      this.scrollToBottom();
    }, 500);

    this.scrollToBottom();
  }

  generateBotReply(message: string): string {
    if (message.toLowerCase().includes('sangre')) {
      return 'Puedes donar sangre si tienes más de 18 años y estás sano.';
    }
    return 'Estoy aquí para ayudarte 😊';
  }

  scrollToBottom() {
    const el = document.getElementById('chat-content');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
