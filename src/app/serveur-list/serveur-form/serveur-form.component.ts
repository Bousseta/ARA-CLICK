import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Serveur } from '../../models/serveur.model';
import { ServeursService } from '../../services/serveurs.service';
import { Router } from '@angular/router';
import { RestaurantsService } from '../../services/Restaurants.service';
import { map } from 'rxjs/operators';
import {Restaurant} from "../../models/restaurant.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-serveur-form',
  templateUrl: './serveur-form.component.html',
  styleUrls: ['./serveur-form.component.scss'],
  providers: [RestaurantsService]
})
export class ServeurFormComponent implements OnInit {

  serveur: Serveur = new Serveur();

  serveurForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  restaurants: any;

  constructor(private formBuilder: FormBuilder,
              private serveursService: ServeursService,
              private restaurantsService: RestaurantsService,
              private router: Router,
              private _location: Location) { }

  ngOnInit() {
    this.initForm();
    this.restaurantsService.getRestaurantsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(restaurants => {
      this.restaurants = restaurants;
    });
  }

  initForm() {
    this.serveurForm = this.formBuilder.group({
      id_restaurant: ['', Validators.required],
      nom: ['', Validators.required],
      cin: ['', Validators.required],
      address: '',
      fixe:['',[Validators.required,Validators.pattern(/[0][5][0-9]{8}/)]],
      mobile: ['',[Validators.required , Validators.pattern(/[0][6-7][0-9]{8}/)]],
      email: ['', [Validators.required, Validators.email]],
      mdp:['', [Validators.required , Validators.minLength(6)]]
    });
  }

  onSaveServeur() {
    const id_restaurant = this.serveurForm.get('id_restaurant').value;
    this.serveur.id_restaurant = id_restaurant;

    if(this.fileUrl && this.fileUrl !== '') {
      this.serveur.photo = this.fileUrl;
    }

    this.serveursService.createServeur(this.serveur);
    this.router.navigate(['/serveurs']);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.serveursService.uploadFile(file).then(
        (url: string) => {
          this.fileUrl = url;
          this.fileIsUploading = false;
          this.fileUploaded = true;
        }
    );
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }
  onBack() {
    this._location.back();
  }
}

