import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingComponent } from './pages/booking/booking.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'restaurant', component: RestaurantComponent },
  { path: '**', redirectTo: '' }
];
