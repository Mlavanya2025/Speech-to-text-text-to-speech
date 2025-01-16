import { Component, OnInit } from '@angular/core';

declare const webkitSpeechRecognition: any;
declare const speechSynthesis: any;

@Component({
  selector: 'app-processspeech',
  templateUrl: './processspeech.component.html',
  styleUrls: ['./processspeech.component.scss']
})

export class ProcessspeechComponent implements OnInit {
  recognizedTexts: string[] = [];
  lastRecognizedSpeech = '';
  recognition: any;

  

  ngOnInit() {}

  startRecognition() {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const speechResult = event.results[event.results.length - 1][0].transcript;
        if (speechResult !== this.lastRecognizedSpeech) {
          this.lastRecognizedSpeech = speechResult;
          this.recognizedTexts = []; // Clear previous recognition
          this.recognizedTexts.push(speechResult);
          this.processSpeech(speechResult);
         
        }
      };

      recognition.start();
    }
  }

  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  processSpeech(speechResult: string) {
    let response = '';

    if (speechResult.includes('How are you')) {
      response = 'I am fine';
    } else if (speechResult.includes("What's your name") || speechResult.includes('What is your name')) {
      response = 'My name is Andrew';
    } else if (speechResult.includes('Open YouTube')) {
      response = 'Opening YouTube...';
      window.open('https://www.youtube.com');
    } else if (speechResult.includes("About you ") || speechResult.includes('Tell me about you')) {
      response = 'My name is Andrew, I am a speech recognizer built with HTML and Angular, built by a team including Harshika, Divya, and Harish.';
    } else if (speechResult.includes('open google')) {
      response = 'Opening Google...';
      window.open('https://www.google.com');
    } else if (speechResult.includes('open gmail')) {
      response = 'Opening Gmail...';
      window.open('https://www.gmail.com');
    } else if (speechResult.includes('open whatsapp')) {
      response = 'Opening WhatsApp...';
      window.open('https://web.whatsapp.com/');
    }

    if (response !== '') {
      this.recognizedTexts.push(response);
      const utterance = new SpeechSynthesisUtterance(response);
      speechSynthesis.speak(utterance);
    }
  }

  
}
