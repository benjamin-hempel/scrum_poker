import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(private translate: TranslateService) { }

  faGlobeEurope = faGlobeEurope;

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
