import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements OnInit{
  collapedSideBar: boolean;
  isAuth: boolean;
  constructor(){
    var firebaseConfig = {
      apiKey: "AIzaSyBcn4HmS18GO2aS9J3gmCpaOU1v12FmD5U",
      authDomain: "ararestaurant1.firebaseapp.com",
      databaseURL: "https://ararestaurant1.firebaseio.com",
      projectId: "ararestaurant1",
      storageBucket: "ararestaurant1.appspot.com",
      messagingSenderId: "364037189287",
      appId: "1:364037189287:web:f6d69dbc5e06171d"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
  }
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }




}
