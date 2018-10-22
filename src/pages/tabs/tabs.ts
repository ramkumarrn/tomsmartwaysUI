import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { RoutePage } from '../route/route';
import { NearbyPage } from '../nearby/nearby';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = RoutePage;
  tab3Root = NearbyPage;
  
  constructor() {

  }
}
