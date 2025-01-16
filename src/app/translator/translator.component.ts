import { Component, OnInit } from '@angular/core';

import axios from 'axios';


interface Language {
  countryCode: string;
  language: string;
  flag: string;
}

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss']
})

export class TranslatorComponent implements OnInit{
  
  languages!: Language[];
  sourceLanguage: string = 'en-GB';
  targetLanguage: string = 'en-GB';
  input!:string;
  translation!:string;
  waiting: boolean = false;
  recognition: any;
  filteredInputLanguages!: Language[];
  filteredTargetLanguages!: Language[];
  inputSearchKey: string = "";
  targetSearchKey: string = "";

  constructor() {
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.addEventListener("result", this.handleSpeechRecognition);
  }
  

  
  async ngOnInit(): Promise<void> {
    const response = await axios.get('https://api-sandbox.translated.com/v2/symbol/languages')
    if(response.data){
      this.languages = response.data.map((l: any) => {
        return {
          countryCode: l.key,
          language: l.value,
          flag: getFlag(l.key)
        };
      }); 
      this.languages.sort((a, b) => a.language.localeCompare(b.language));
      // adding a language at the bottom because of filtering comments below
      this.languages.push(this.languages[0])
      this.filteredInputLanguages = this.languages
      this.filteredTargetLanguages = this.languages
    }
  }

  swapLanguages(){
    let temp: string = this.sourceLanguage;
    this.sourceLanguage = this.targetLanguage
    this.targetLanguage = temp;

    if(this.translation.length > 0){
      temp = this.input;
      this.input = this.translation
      this.translation = temp;
    }
  }

  async translate(){
    if(this.input.length < 1) return;
    if(this.sourceLanguage == this.targetLanguage) {
      this.translation = this.input
      return;
    }
    this.input.trim()
    this.waiting = true;
    let url: string = `https://api.mymemory.translated.net/get?q=${this.input}!&langpair=${this.sourceLanguage}|${this.targetLanguage}`;
    const response = await axios.get(url)
    if(response.data){
      this.translation = response.data.responseData.translatedText  
    }
    this.waiting = false;
  }

  async copy(){
    try {
      await navigator.clipboard.writeText(this.translation);
    }
    catch (err) {
      console.error('Could not write to clipboard', err);
    }
  }

  speak(text: string, language: string){
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  }
  voiceInput() {
    if (this.recognition && this.recognition.isListening) {
      this.recognition.stop();
      this.recognition.isListening = false;
    } else {
      this.recognition.lang = this.sourceLanguage;
      this.recognition.start();
      this.recognition.isListening = true;
    }
  }

  handleSpeechRecognition = (e: any) => {
    const text = Array.from(e.results)
      .map((result: any) => result[0])
      .map((result: any) => result.transcript)
      .join("");

    this.input = text;
  };

  filterInput() {
    this.filteredInputLanguages = this.filterLanguages(this.inputSearchKey, this.sourceLanguage);
  }
  
  filterTarget() {
    this.filteredTargetLanguages = this.filterLanguages(this.targetSearchKey, this.targetLanguage);
  }
  
  filterLanguages(key: string, selectedLanguage: string) {    
    let list = this.languages.filter((l) =>
      l.language.toLowerCase().includes(key.trim().toLowerCase())
    );
    

    // selected language is added to the end so as not to remove selected value if not in filtered list
    // last item in list isn't displayed in UI anyways so duplicate language isn't a concern
    const selectedLang = this.languages.find((lang) => lang.countryCode === selectedLanguage);
    if (selectedLang) list.push(selectedLang);      
    return list;
  }
  
}

    

function getFlag(countryCode: string): string {
  const lastTwoChars = countryCode.slice(-2);
  const codePoints: number[] = lastTwoChars
    .toUpperCase()
    .split('')
    .map((char: string) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
