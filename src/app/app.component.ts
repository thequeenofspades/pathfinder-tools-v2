import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pathfinder Tools';

  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('assets/mdi.svg'));
  }
}
