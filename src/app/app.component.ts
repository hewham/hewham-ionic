import { Component } from '@angular/core';
import p from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  version = p.version;

  public appPages = [
    { title: 'Portfolio', url: '', icon: 'library' },
    { title: 'JS Experiments', url: 'js', icon: 'flask' }
  ];

  constructor() {}
}
