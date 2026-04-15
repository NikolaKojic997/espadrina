import { Component, inject, output, PLATFORM_ID, signal, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../../../language.service';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-booking-stay',
  templateUrl: './stay.component.html',
  styleUrl: './stay.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule]
})
export class StayComponent {
  langService = inject(LanguageService);
  platformId = inject(PLATFORM_ID);
  onNext = output<void>();

  isBrowser = signal(false);

  today = new Date();
  // By default let's make sure the hardcoded testing dates are in the future
  // or just keep them but respect the minDate visually in the datepicker
  checkIn: Date | null = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 2);
  checkOut: Date | null = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5);

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  get minCheckOutDate(): Date {
    if (this.checkIn) {
      const min = new Date(this.checkIn);
      // Check-out must be at least 1 day after check-in
      min.setDate(min.getDate() + 1);
      return min;
    }
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return tmrw;
  }

  onCheckInChange() {
    // If checkIn changes and checkOut is now invalid, push checkOut forward
    if (this.checkIn && this.checkOut) {
      if (this.checkOut <= this.checkIn) {
        this.checkOut = this.minCheckOutDate;
      }
    }
  }

  apartments = 1;
  guests = 2;

  increaseApartments() {
    if (this.apartments < 6) {
      this.apartments++;
    }
  }

  decreaseApartments() {
    if (this.apartments > 1) {
      this.apartments--;
      if (this.guests > this.apartments * 4) {
        this.guests = this.apartments * 4;
      }
    }
  }

  increaseGuests() {
    if (this.guests < this.apartments * 4) {
      this.guests++;
    }
  }

  decreaseGuests() {
    if (this.guests > 1) {
      this.guests--;
    }
  }

  isPromoMode = signal(false);
  promoCode = signal('');

  promoStatus = computed(() => {
    const code = this.promoCode().trim();
    if (!code) return 'none';
    return 'valid'; // All non-empty codes are valid for now
  });

  @ViewChild('promoInput') promoInput!: ElementRef<HTMLInputElement>;

  togglePromo() {
    this.isPromoMode.set(true);
    setTimeout(() => {
      if (this.promoInput) {
        this.promoInput.nativeElement.focus();
      }
    });
  }

  onPromoBlur() {
    // Revert to original state only if the user didn't enter any promo code
    if (!this.promoCode().trim()) {
      this.isPromoMode.set(false);
    }
  }

  isSearchDone = signal(false);

  onSearch() {
    this.isSearchDone.set(true);
  }

  guestsArray() {
    return Array.from({ length: this.guests });
  }

  get nights(): number {
    if (this.checkIn && this.checkOut) {
      const diffTime = Math.abs(this.checkOut.getTime() - this.checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  get basePrice(): number {
    return this.apartments * this.nights * 350;
  }

  get finalPrice(): number {
    const discount = this.promoStatus() === 'valid' ? 0.10 : 0;
    return this.basePrice * (1 - discount);
  }

  get remainingAmountText(): string {
    const template = this.langService.current().booking?.stay?.remainingAmount;
    if (template) {
      return template.replace('{{price}}', this.finalPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
    }
    return '';
  }
}
