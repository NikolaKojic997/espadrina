import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Lang, translations } from './translations';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'user-lang';
  private platformId = inject(PLATFORM_ID);
  
  // Initialize from localStorage or default to 'en' (safe for SSR)
  private langSignal = signal<Lang>('en');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem(this.LANG_KEY) as Lang;
      if (savedLang) {
        this.langSignal.set(savedLang);
      }
    }
  }

  // Computed signal that returns the current dictionary
  current = computed(() => translations[this.langSignal()]);
  
  // Expose current language
  currentLang = computed(() => this.langSignal());

  setLanguage(lang: Lang) {
    this.langSignal.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LANG_KEY, lang);
    }
  }

  toggleLanguage() {
    const nextLang = this.langSignal() === 'en' ? 'sr' : 'en';
    this.setLanguage(nextLang);
  }
}
