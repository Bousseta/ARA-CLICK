import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Profil} from "../models/profil.model";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";

@Injectable()
export class AuthService {
  private dbPath = '/profil';
  authRef: AngularFireList<Profil> = null;
  profil: Profil[] = [];

  constructor(private db: AngularFireDatabase) {
    this.authRef = db.list(this.dbPath);
  }

  createNewUser(email: string, password: string) {
    return new Promise(
        (resolve, reject) => {
          firebase.auth().createUserWithEmailAndPassword(email, password).then(
              () => {
                resolve();
              },
              (error) => {
                reject(error);
              }
          );
          var user = firebase.auth().currentUser;
          user.sendEmailVerification().then(function() {
            // Email sent.
          }).catch(function(error) {
            // An error happened.
          });
        }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
        (resolve, reject) => {
          firebase.auth().signInWithEmailAndPassword(email, password).then(
              () => {
                resolve();
              },
              (error) => {
                reject(error);
              }
          );
        }
    );
  }
  createProfil(profil: Profil): void {
    this.authRef.push(profil);
  }

  signOutUser() {
    firebase.auth().signOut();
  }

}
