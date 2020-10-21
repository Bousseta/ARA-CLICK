import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {Categorie} from '../models/categorie.model';
import * as firebase from 'firebase';

@Injectable()
export class CategoriesService {

    private dbPath = '/categories';
    categoriesRef: AngularFireList<Categorie> = null;


    constructor(private db: AngularFireDatabase) {
        this.categoriesRef = db.list(this.dbPath);
    }

    createCategorie(categorie: Categorie): void {
        this.categoriesRef.push(categorie);
    }

    getCategorieList(): AngularFireList<Categorie> {
        return this.categoriesRef;
    }


  getSingleCategorie(id) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/categories/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

    deleteCategorie(key: string, thumb): Promise<void> {
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
        return this.categoriesRef.remove(key);
    }

    updateCategorie(key: string, value: any): Promise<void> {
        return this.categoriesRef.update(key, value);
    }

    uploadFile(file: File) {
        return new Promise(
            (resolve, reject) => {
                const almostUniqueFileName = Date.now().toString();
                const upload = firebase.storage().ref()
                    .child('categorie_images/' + almostUniqueFileName + file.name).put(file);
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
