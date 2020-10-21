import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../services/Restaurants.service';
import { Restaurant } from '../models/restaurant.model';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import {Input} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";


@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss'],
  providers: [RestaurantsService]
})
export class RestaurantListComponent implements OnInit {
  @Input() collectionSize;
  @Input() pageSize;
  @Input() page;
  @Input() slice;
  @Input() restaurant: Restaurant;
  restaurants: any;
  submitted = false;

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

  items = [];
  pageOfItems: Array<any>;

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
    this.items = Array(150).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
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
    this.router.navigate(['/restaurants', 'view', id]);
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
  get f() { return this.restaurantForm.controls; }
}
