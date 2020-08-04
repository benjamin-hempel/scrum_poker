import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Non-Angular
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QRCodeModule } from 'angularx-qrcode';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Components
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { RoomComponent } from './components/room/room.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

// Services and models
import { RoomService } from './services/room.service';
import { SignalRService } from './services/backend/signalr.service';
import { MockBackendService } from './services/backend/mock-backend.service';
import { Room } from './models/room';

// Routes
import { routes } from './routes';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RoomComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    QRCodeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [RoomService, Room, SignalRService, MockBackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Needed for ngx-translate to work with Angular CLI server
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
