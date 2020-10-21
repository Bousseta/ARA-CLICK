import { Injectable } from '@angular/core';
import {Serveur} from '../models/Serveur.model';
import * as firebase from 'firebase';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";



@Injectable( )
export class ServeursService {

  private dbPath = '/serveurs';
  serveursRef: AngularFireList<Serveur> = null;

  serveurs: Serveur[] = [];


  constructor(private db: AngularFireDatabase) {
    this.serveursRef = db.list(this.dbPath);
  }

  createServeur(serveur: Serveur): void {
    this.serveursRef.push(serveur);
  }

  getServeursList(): AngularFireList<Serveur> {
    return this.serveursRef;
  }

  getSingleServeur(id){
    return new Promise(
      (resolve, reject)=>{
        firebase.database().ref('/serveurs/' + id).once('value').then(
          (data)=>{
            resolve(data.val());
          }, (error)=>{
            reject(error);
          }
        );
      }
    );
  }

  deleteServeur(key: string, photo): Promise<void> {
    if(photo) {
      const storageRef = firebase.storage().refFromURL(photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    return this.serveursRef.remove(key);
  }

  updateServeur(key: string, value: any): Promise<void> {
    return this.serveursRef.update(key, value);
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
