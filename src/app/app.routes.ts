import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingComponent } from './pages/booking/booking.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { WellnessComponent } from './pages/wellness/wellness';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'restaurant', component: RestaurantComponent },
  { path: 'wellness', component: WellnessComponent },
  { path: '**', redirectTo: '' }
];
