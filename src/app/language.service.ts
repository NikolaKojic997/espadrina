import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PrimeNG } from 'primeng/config';

export type Lang = 'en' | 'sr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'user-lang';
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private primeng = inject(PrimeNG);
  
  private langSignal = signal<Lang>('en');
  // English is the default hardcoded state
  private translationsSignal = signal<any>(this.getDefaultEnglish());

  initPromise: Promise<void>;
  
  constructor() {
    this.initPromise = this.initLanguage();
  }

  private updatePrimeNGTranslation(lang: Lang) {
    if (lang === 'sr') {
      this.primeng.setTranslation({
        dayNames: ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
        dayNamesShort: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
        dayNamesMin: ["Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su"],
        monthNames: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
        today: 'Danas',
        clear: 'Očisti'
      });
    } else {
      this.primeng.setTranslation({
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        today: 'Today',
        clear: 'Clear'
      });
    }
  }

  private getDefaultEnglish() {
    return {
      nav: { 
        bookNow: 'Book now', 
        restaurant: 'Restaurant', 
        menu: 'MENU', 
        links: { 
          home: 'Home', 
          experience: 'Experience', 
          wellness: 'Wellness', 
          contact: 'Contact' 
        } 
      },
      flow: { 
        title: 'FIND YOURSELF ALONG THE TIMELESS FLOW OF THE DRINA', 
        desc: 'On the banks of the Drina, luxury takes on a different meaning. More intimate, more grounded, more real. It is a place to slow down, reconnect with nature, and rediscover the beauty of simplicity, comfort and belonging.', 
        cta: 'Explore Drina', 
        comingSoon: 'Booking system is coming soon...' 
      },
      luxury: { 
        title: 'LUXURY ESCAPE', 
        desc: 'Luxury apartments provide a perfect blend of modern comfort and natural peace, designed for your ultimate relaxation.', 
        cta: 'Find yourself' 
      },
      food: { 
        title: 'TIMELESS FOOD', 
        desc: 'Enjoy authentic local flavors, prepared with care from the freshest ingredients of the Drina region.', 
        cta: 'Find out more', 
        comingSoon: 'Everything will be implemented soon' 
      },
      spa: { 
        title: 'YOUR PERSONAL SPA', 
        desc: 'Relax in our exclusive spa center, where natural tranquility meets premium treatments for your body and mind.', 
        cta: 'Find out more' 
      },
      pool: { 
        title: 'POOL ON YOU', 
        desc: 'Dive into a refreshing pool with views of the river and mountains, creating memories that last forever.', 
        cta: 'Find out more' 
      },
      inspiration: { 
        title: 'ENDLESS INSPIRATION', 
        desc: 'Let the beauty of the Drina inspire you. Our resort is a sanctuary for those seeking authenticity, peace, and unforgettable moments by the sound of the water.', 
        cta: 'CONTACT US' 
      },
      booking: {
        stages: {
          stay: 'Your stay',
          payment: 'Payment details',
          confirmation: 'Confirmation',
          back: 'Back'
        },
        stay: {
          arrival: 'CHECK-IN DATE',
          departure: 'CHECK-OUT DATE',
          guests: 'NUMBER OF GUESTS',
          apartments: 'NUMBER OF APARTMENTS',
          promo: 'Apply promo code',
          search: 'SEARCH',
          editSearch: 'Edit search',
          personalInfo: 'Personal Information',
          title: 'Title',
          firstName: 'First name',
          lastName: 'Last name',
          countryCode: 'Country code',
          selectCountryCode: 'Select calling code',
          phoneNumber: 'Phone number',
          email: 'Email',
          country: 'Country of residence',
          mr: 'Mr',
          mrs: 'Mrs',
          mrShort: 'Mr.',
          serbia: 'Serbia',
          prepareStay: 'Prepare your stay',
          apartment: 'Apartment',
          aprtShort: 'apt',
          adults: 'adults',
          age: 'Age',
          adultShort: 'Adult',
          arrivalTime: 'Arrival time',
          selectArrivalTime: 'Select arrival time',
          specialRequests: 'Special requests',
          specialRequestsHint: 'You can describe any special request. Special requests cannot be guaranteed, but we will do our best to accommodate them.',
          termsTitle: 'General Terms of Sale',
          depositTerms: '<strong>Guarantee deposit</strong> 0 € (No guarantee payment. A bank card number is required, but the card will not be charged.)',
          cancelTerms: '<strong>Cancellation policy:</strong> If canceled or in case of a no-show, the first night without additional services is billed and non-refundable.',
          newsletter1: 'I wish to receive information from your establishment.',
          newsletter2: 'I wish to receive information from your partners.',
          acceptTerms: '* I have read the price conditions of sale and confirm that I understand and accept them.',
          privacyNotice: 'Landa processes data based on your consent. To find out more, see our privacy policy.',
          bookNowBtn: 'Book now and pay later',
          secureNotice: 'You will be redirected to our secure site to enter your search details.',
          rooms: 'Rooms',
          promoCode: 'Promo Code',
          bestTariff: 'Best available rate',
          total: 'Total',
          durationNights: 'Duration',
          nightsText: 'nights',
          nightsShort: 'nights',
          daysText: 'days',
          guestsText: 'guests',
          apartmentsText: 'apartments',
          remainingAmount: '<strong>Remaining amount:</strong> The remaining amount of {price} € is payable on site upon arrival.'
        },
        info: {
          address: 'espadrina vojvode misica 17 ljubovija,<br>Serbia',
          moreInfo: 'More information',
          contact: 'Contact us',
          paymentMethods: 'Payment methods'
        },
        payment: {
          cardTitle: 'Payment card',
          cardNumber: 'Card number',
          expiry: 'Expiry date',
          month: 'Month...',
          year: 'Year...',
          cvv: 'CVV/CCV',
          cardHolder: 'Cardholder name',
          confirm: 'Confirm reservation',
          cartTitle: 'Cart details',
          cartSummary: '5 nights, 2 adults',
          total: 'Total amount',
          payOnSite: 'Pay on site',
          settleNow: 'Settle now',
          guarantee: 'Your credit card number is required as a guarantee'
        },
        success: {
          title: 'YOUR RESERVATION HAS BEEN RECEIVED',
          subtitle: 'Expect an official confirmation via email'
        },
        footer: {
          cancel: 'Change or cancel reservation',
          privacy: 'Privacy policy'
        }
      },
      lang: {
        sr: 'SR',
        en: 'EN'
      },
      company: {
        name: 'ESPADRINA',
        footerName: 'E S P A D R I N A'
      },
      footer: { rights: '2026 Espadrina. All Rights Reserved.' },
      restaurant: {
        hero: {
          subtitle: 'our hidden gem',
          scroll: 'scroll for more'
        },
        wine: {
          title: 'LOCAL DRINKS & WINES',
          desc: 'Discover a selection of the best local wines and drinks that perfectly accompany our gastronomic creations.'
        },
        ingredients: {
          title: 'Where local natures\nfood meets modern\nculinary exellence',
          desc: 'We layer Surinamese-Hindustani spices, French precision and Dutch seasonal produce into\ndishes that feel both familiar and daring. Every plate tells a story and ends with a smile..'
        },
        chef: {
          title_meet: 'MEET',
          title_our: 'OUR',
          title_chef: 'CHEF',
          name: 'CHEF GAGA',
          desc: 'At Espadrina, water is part of every moment of the stay.\n\nFrom private terrace pools and the main outdoor pool to the spa experience and the riverside beach, the entire setting is designed to keep you connected to freshness, calm, and the rhythm of nature.\n\nDrina remains at the heart of the landscape — present in the view, the atmosphere, and the feeling of being fully removed from the everyday.'
        },
        menu: {
          title: 'WHERE EVERY DISH IS REMINDER OF PEACE',
          cta: 'View our menu'
        },
        dessert: {
          title: 'SWEET MOMENTS',
          desc: 'Finish your meal with our hand-made desserts that combine traditional recipes with modern pastry making.'
        }
      }
    };
  }

  private async initLanguage() {
    let initialLang: Lang = 'en';
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem(this.LANG_KEY) as Lang;
      if (savedLang) {
        initialLang = savedLang;
      }
    }
    await this.setLanguage(initialLang);
  }

  // Computed signal that returns the current dictionary
  current = computed(() => this.translationsSignal());
  
  // Expose current language
  currentLang = computed(() => this.langSignal());

  async setLanguage(lang: Lang) {
    this.langSignal.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LANG_KEY, lang);
    }

    this.updatePrimeNGTranslation(lang);

    try {
      const content = await firstValueFrom(
        this.http.get(`/i18n/${lang}.properties`, { responseType: 'text' })
      );
      const parsed = this.parseProperties(content);
      // Merge with default English to ensure all keys exist
      const merged = this.deepMerge(this.getDefaultEnglish(), parsed);
      this.translationsSignal.set(merged);
    } catch (err) {
      console.error(`Failed to load ${lang}.properties`, err);
      // If it fails and we are switching to non-english, we might want to still show English
      if (lang !== 'en' && !this.translationsSignal().nav.bookNow) {
        this.translationsSignal.set(this.getDefaultEnglish());
      }
    }
  }

  toggleLanguage() {
    const nextLang = this.langSignal() === 'en' ? 'sr' : 'en';
    this.setLanguage(nextLang);
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * Simple parser for .properties files that supports dot notation for nesting
   */
  private parseProperties(content: string): any {
    const result: any = {};
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

      const index = trimmed.indexOf('=');
      if (index === -1) continue;

      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/\\n/g, '\n');

      // Handle nested keys like nav.links.experience
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = value;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      }
    }
    return result;
  }
}
