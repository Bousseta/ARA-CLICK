import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Plat } from '../models/plat.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";


@Injectable()
export class PlatsService {

  private dbPath = '/menuItems';
  platsRef: AngularFireList<Plat> = null;


  plats: Plat[] = [];
  platsSubject = new Subject<Plat[]>();

  constructor(private db: AngularFireDatabase) {
    this.platsRef = db.list(this.dbPath);
  }


  createPlat(plat: Plat): void {
    this.platsRef.push(plat);
  }

  getPlatList(): AngularFireList<Plat> {
    return this.platsRef;
  }


  getSinglePlat(id) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/menuItems/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  deletePlat(key: string, thumb): Promise<void> {
    if(thumb) {
      const storageRef = firebase.storage().refFromURL(thumb);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    return this.platsRef.remove(key);
  }


  updatePlat(key: string, value: any): Promise<void> {
    return this.platsRef.update(key, value);
  }



  uploadFile(file: File) {
    return new Promise(
        (resolve, reject) => {
          const almostUniqueFileName = Date.now().toString();
          const upload = firebase.storage().ref()
              .child('plat_images/' + almostUniqueFileName + file.name).put(file);
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
