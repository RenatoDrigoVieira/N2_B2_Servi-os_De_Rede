import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {
  menuOpened = new BehaviorSubject<boolean>(false);

  constructor() {}

  toggleMenu() {
    this.menuOpened.next(!this.menuOpened.value);
  }
}
