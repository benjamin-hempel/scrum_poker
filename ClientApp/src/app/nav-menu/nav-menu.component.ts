import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { faGlobe } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(private translate: TranslateService) { }

  faGlobe = faGlobe;

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
