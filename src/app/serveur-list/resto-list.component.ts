import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../services/Restaurants.service';
import { Restaurant } from '../models/restaurant.model';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import {Input} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Location} from "@angular/common";


@Component({
  selector: 'app-resto-list',
  templateUrl: './resto-list.component.html',
  styleUrls: ['./resto-list.component.scss'],
  providers: [RestaurantsService]
})
export class RestoListComponent implements OnInit {

  @Input() restaurant: Restaurant;
  restaurants: any;

  public popoverTitle: string='Confirmation';
  public popoverMessage: string='Êtes-vous sûr de vouloir supprimer ce restaurant?';
  public cancelClicked:boolean=false;
  public confirmClicked:boolean=false;
  editState:boolean=false;
  restaurantToEdit:Restaurant;
  restaurantForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  lat: string='';
  lng: string='';
  location: Object;
  userId: string;

  constructor(private restaurantsService: RestaurantsService,
              private router: Router,
              private formBuilder: FormBuilder,
              private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.initForm();
    this.afAuth.authState.subscribe(user=>{
      if(user) this.userId = user.uid;
    });
    this.restaurantsService.getRestaurantsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(restaurants => {
      this.restaurants = restaurants;
    });
  }

  onNewRestaurant() {
    this.router.navigate(['/restaurants', 'new']);
  }

  onDeleteRestaurant(key, logo) {
    this.restaurantsService
      .deleteRestaurant(key, logo)
      .catch(err => console.log(err));
  }

  onViewRestaurant(id: number) {
    this.router.navigate(['/resto', 'view', id]);
  }



  initForm() {
    this.restaurantForm = this.formBuilder.group({
      storeName: ['', Validators.required],
      desc: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lat: '',
      lng:'',
      facebookPage: '',
      instagramPage: '',
      twitterPage: '',
      pinterestPage: '',
      nbrTable:['', Validators.required]
    });
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.restaurantsService.uploadFile(file).then(
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

  editRestaurant(event, id){
    this.editState = true;
    this.restaurantToEdit = id;
    this.lat = this.restaurants[id].lat;
    this.lng = this.restaurants[id].lng;
  }


  updateRestaurant(restaurant){
    restaurant.lat = this.lat;
    restaurant.lng = this.lng;
    if(this.fileUrl && this.fileUrl !== '') {
      restaurant.logo = this.fileUrl;
    }
    this.restaurantsService.updateRestaurant(restaurant.key, {
      storeName: restaurant.storeName,
      desc: restaurant.desc,
      address : restaurant.address,
      phoneNumber : restaurant.phoneNumber,
      email: restaurant.email,
      lat : this.lat,
      lng : this.lng,
      facebookPage: restaurant.facebookPage,
      instagramPage: restaurant.instagramPage,
      twitterPage: restaurant.twitterPage,
      pinterestPage: restaurant.pinterestPage,
      nbrTable: restaurant.nbrTable,
      logo: restaurant.logo
    });
    this.clearState();
  }

  clearState(){
    this.editState = false;
    this.restaurantToEdit = null;
  }

  onChoseLocation(event){
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }
  onBack() {
    this.router.navigate(['/dashboard']);
  }
}
