import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {Restaurant} from '../models/restaurant.model';
import * as firebase from 'firebase';



@Injectable( )
export class RestaurantsService {

    private dbPath = '/restaurants';
    restaurantsRef: AngularFireList<Restaurant> = null;
    

  constructor(private db: AngularFireDatabase) {
    this.restaurantsRef = db.list(this.dbPath);
  }

    createRestaurant(restaurant: Restaurant) {
        this.restaurantsRef.push(restaurant);
    }

    getRestaurantsList(): AngularFireList<Restaurant> {
        return this.restaurantsRef;
    }


  getSingleRestaurant(id){
    return new Promise(
      (resolve, reject)=>{
        firebase.database().ref('/restaurants/' + id).once('value').then(
          (data)=>{
            resolve(data.val());
          }, (error)=>{
            reject(error);
          }
        );
      }
    );
  }


    deleteRestaurant(key: string, logo): Promise<void> {
        if(logo) {
            const storageRef = firebase.storage().refFromURL(logo);
            storageRef.delete().then(
                () => {
                    console.log('Photo removed!');
                },
                (error) => {
                    console.log('Could not remove photo! : ' + error);
                }
            );
        }
        return this.restaurantsRef.remove(key);
    }


    updateRestaurant(key: string, value: any): Promise<void> {
        return this.restaurantsRef.update(key, value);
    }

    
    uploadFile(file: File) {
        return new Promise(
            (resolve, reject) => {
                const almostUniqueFileName = Date.now().toString();
                const upload = firebase.storage().ref()
                    .child('images/' + almostUniqueFileName + file.name).put(file);
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
