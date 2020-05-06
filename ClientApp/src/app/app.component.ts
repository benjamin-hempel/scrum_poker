import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'app';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('de');
  }
}
