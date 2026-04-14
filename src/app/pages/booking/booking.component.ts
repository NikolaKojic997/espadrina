import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../language.service';
import { StayComponent } from './components/stay/stay.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    StayComponent, 
    PaymentComponent, 
    ConfirmationComponent
  ]
})
export class BookingComponent {
  langService = inject(LanguageService);
  currentStep = signal(1);

  nextStep() {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1 && this.currentStep() < 3) {
      this.currentStep.update(s => s - 1);
    }
  }

  isCompleted(step: number): boolean {
    return this.currentStep() > step;
  }

  isActive(step: number): boolean {
    return this.currentStep() === step;
  }
}
