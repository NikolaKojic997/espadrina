import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../language.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class ConfirmationComponent {
  langService = inject(LanguageService);
}
