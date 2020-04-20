import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MenuService, menuApp } from '../app/servicios/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  menus : menuApp[] = [];

  constructor(private platform: Platform,private splashScreen: SplashScreen,
    private statusBar: StatusBar, private menuService:MenuService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(){
    this.menuService.menuCambio.subscribe(data =>{
      this.menus = data;
    });
  }

}
