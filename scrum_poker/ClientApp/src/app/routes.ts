import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { RoomComponent } from './components/room/room.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'room', component: RoomComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: ':rid', component: HomeComponent }
];
