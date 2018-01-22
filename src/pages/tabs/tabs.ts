import { Component } from '@angular/core';

import { ProcessPage } from '../process/process';
import { ResultPage } from '../result/result';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ProcessPage;
  tab3Root = ResultPage;

  constructor() {

  }
}
