import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ServeursService } from '../services/Serveurs.service';
import { Serveur } from '../models/serveur.model';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {RestaurantsService} from "../services/restaurants.service";
import { map } from 'rxjs/operators';
import {Restaurant} from "../models/restaurant.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-serveur-list',
  templateUrl: './serveur-list.component.html',
  styleUrls: ['./serveur-list.component.scss'],
  providers: [ServeursService]
})
export class ServeurListComponent implements OnInit {

  @Input() serveur: Serveur;
  serveurs: any;
  public popoverTitle: string='Confirmation';
  public popoverMessage: string='Êtes-vous sûr de vouloir supprimer ce Serveur?';
  public cancelClicked:boolean=false;
  public confirmClicked:boolean=false;
  editState:boolean=false;
  serveurToEdit:Serveur;
  restaurant: Restaurant;
  serveurForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  restaurants: any;
  id= this.route.snapshot.params['id'];
 
  

  constructor(private route: ActivatedRoute,
              private serveursService: ServeursService,
              private router: Router,
              private formBuilder: FormBuilder,
              private restaurantsService: RestaurantsService,
              private _location: Location) {}

  ngOnInit() {
    this.initForm();
    this.restaurant = new Restaurant();
    const id = this.route.snapshot.params['id'];
    this.serveursService.getServeursList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(serveurs => {
      this.serveurs = serveurs;

    }
    );

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

  onNewServeur() {
    this.router.navigate(['/serveurs', 'new']);
  }

  onDeleteServeur(key, photo) {
    this.serveursService
      .deleteServeur(key, photo)
      .catch(err => console.log(err));
  }

  onViewServeur(id) {
    this.router.navigate(['/serveurs', 'view', id]);
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

  editServeur(event, id){
    this.editState = true;
    this.serveurToEdit = id;
  }

  updateServeur(serveur){
    if(this.fileUrl && this.fileUrl !== '') {
      serveur.photo = this.fileUrl;
    }
    this.serveursService.updateServeur(serveur.key, {
      id_restaurant:serveur.id_restaurant,
      photo:serveur.photo,
      nom: serveur.nom,
      cin: serveur.cin,
      adress: serveur.adress,
      mobile: serveur.mobile,
      fixe: serveur.fixe,
      email: serveur.email,
      mdp : serveur.mdp
    });
    this.clearState();
  }

  clearState(){
    this.editState = false;
    this.serveurToEdit = null;
  }
  onBack() {
    this._location.back();
  }

}
