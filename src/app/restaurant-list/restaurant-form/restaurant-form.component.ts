import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from '../../models/restaurant.model';
import { RestaurantsService } from '../../services/restaurants.service';
import { Router } from '@angular/router';
import {MapsService} from '../../services/maps.service';
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent implements OnInit {

  restaurant: Restaurant = new Restaurant();
  submitted = false;
  restaurantForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  lat: string='34.0389';
  lng: string='-6.8166';
  lat1: string='34.0389';
  lng1: string='-6.8166';
  location: Object;
  userId: string;

  constructor(private formBuilder: FormBuilder,
              private restaurantsService: RestaurantsService,
              private router: Router,
              private map:MapsService,
              private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.initForm();
    this.map.getLocation().subscribe(data =>{
      this.lat = data.latitude;
      this.lng = data.longitude;
      this.lat1 = data.latitude;
      this.lng1 = data.longitude;
    });
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    });
    this.restaurant.facebookPage = ''; 
    this.restaurant.instagramPage = '';
    this.restaurant.twitterPage = '';
    this.restaurant.pinterestPage = '';
    this.restaurant.userID='';
    
  }

  initForm() {
    this.restaurantForm = this.formBuilder.group({
      storeName: ['', Validators.required],
      desc: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required , Validators.pattern(/[0][6-7][0-9]{8}/)]],
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

  onSaveRestaurant() {
    if(this.fileUrl && this.fileUrl !== '') {
      this.restaurant.logo = this.fileUrl;
    }
    this.restaurant.lat = this.lat;
    this.restaurant.lng = this.lng;

    this.restaurant.userID = this.userId;

    this.restaurantsService.createRestaurant(this.restaurant);
    this.router.navigate(['/restaurants']);
    this.submitted = true;
    if (this.restaurantForm.invalid) {
      return;
    }


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

  onChoseLocation(event){
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }
  onBack() {
    this.router.navigate(['/restaurants']);
  }
  get f() { return this.restaurantForm.controls; }

}

