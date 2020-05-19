import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Icons
import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent {
  constructor(private translate: TranslateService) { }

  faGlobeEurope = faGlobeEurope;

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
