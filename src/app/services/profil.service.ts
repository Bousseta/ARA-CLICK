import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import {Profil} from "../models/profil.model";
import {Customer} from "../models/customer.model";



@Injectable( )
export class ProfilService {

  private dbPath = '/restaurants';
  profilRef: AngularFireList<Profil> = null;

  profil: Profil[] = [];


  constructor(private db: AngularFireDatabase) {
    this.profilRef = db.list(this.dbPath);
  }

  createProfil(profil: Profil): void {
    this.profilRef.push(profil);
  }
  getProfilList(): AngularFireList<Profil> {
    return this.profilRef;
  }

  getSingleProfil(id){
    return new Promise(
      (resolve, reject)=>{
        firebase.database().ref('/user/' + id).once('value').then(
          (data)=>{
            resolve(data.val());
          }, (error)=>{
            reject(error);
          }
        );
      }
    );
  }
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images_serveur/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }


}
