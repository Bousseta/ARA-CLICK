import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsService } from '../../services/restaurants.service';
import { Categorie } from '../../models/categorie.model';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import {Restaurant} from "../../models/restaurant.model";




@Component({
  selector: 'app-single-restaurant',
  templateUrl: './single-restaurant.component.html',
  styleUrls: ['./single-restaurant.component.scss'],

})

export class SingleRestaurantComponent implements OnInit {

  meridian = true;
  etat = true ;
  restaurant: Restaurant;
  categories: any;
  public popoverTitle: string='Confirmation';
  public popoverMessage: string='Êtes-vous sûr de vouloir supprimer ce restaurant?';
  public cancelClicked:boolean=false;
  public confirmClicked:boolean=false;
  editState:boolean=false;
  categorieToEdit:Categorie;
  categorieForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  id = this.route.snapshot.params['id'];

  constructor(private route: ActivatedRoute,
              private restaurantsService: RestaurantsService,
              private router: Router,
              private categoriesService: CategoriesService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.restaurant = new Restaurant();
    const id = this.route.snapshot.params['id'];
    this.restaurantsService.getSingleRestaurant(id).then(
      (restaurant: Restaurant) => {
        this.restaurant = restaurant;
      }
    );

    this.categoriesService.getCategorieList().snapshotChanges().pipe(
        map(changes =>
            changes.map(c =>
                ({ key: c.payload.key, ...c.payload.val() })
            )
        )
    ).subscribe(categories => {
      this.categories = categories;
    });
  }

  onBack() {
    this.router.navigate(['/restaurants']);
  }

  onNewCategorie(){
    this.router.navigate(['/categories','new',this.route.snapshot.params['id']]);
  }

  onDeleteCategorie(key, thumb) {
    this.categoriesService
        .deleteCategorie(key, thumb)
        .catch(err => console.log(err));
  }

  onViewCategorie(id) {
    this.router.navigate(['/categories', 'view', id]);
  }


  initForm() {
    this.categorieForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      url: '',
      featured: '',
      icon: '',
      etat:'',
    });
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.categoriesService.uploadFile(file).then(
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

  editCategorie(event, id){
    this.editState = true;
    this.categorieToEdit = id;
  }

  updateCategorie(categorie){
    if(this.fileUrl && this.fileUrl !== '') {
      categorie.thumb = this.fileUrl;
    }
    this.categoriesService.updateCategorie(categorie.key, {
      title: categorie.title,
      desc: categorie.desc,
      url: categorie.url,
      featured:categorie.featured,
      icon:categorie.icon,
      thumb: categorie.thumb,
      etat: categorie.etat,
    });
    this.clearState();
  }

  clearState(){
    this.editState = false;
    this.categorieToEdit = null;
  }
  toggleMeridian(id) {
    this.meridian = !this.meridian;
    this.categorieToEdit = id;
  }
  toggleEtat() {
    this.etat = !this.etat;
  }
  changeDisable() {
    if (this.categorieForm.controls['Etat'].disabled) {
      this.categorieForm.controls['Etat'].enable() ;
    } else {
      this.categorieForm.controls['Etat'].disable() ;
    }

  }

}
