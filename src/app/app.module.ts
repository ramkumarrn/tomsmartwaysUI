import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, RootNode } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IncidentModalPage } from '../pages/incident-modal/incident-modal';
import { RoutePage } from '../pages/route/route';
import { NearbyPage } from '../pages/nearby/nearby';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    IncidentModalPage,
    RoutePage,
    NearbyPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    IncidentModalPage,
    RoutePage,
    NearbyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
