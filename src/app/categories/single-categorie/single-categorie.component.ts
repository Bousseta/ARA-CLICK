import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CategoriesService} from "../../services/categories.service";
import {Location} from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {PlatsService} from "../../services/plats.service";
import {Plat} from "../../models/plat.model";

import { map } from 'rxjs/operators';
import {Categorie} from "../../models/categorie.model";

@Component({
  selector: 'app-single-categorie',
  templateUrl: './single-categorie.component.html',
  styleUrls: ['./single-categorie.component.scss']
})
export class SingleCategorieComponent implements OnInit {
  meridian = true;
  etat = true;
  categorie: Categorie;
  plats: any;
  public popoverTitle: string='Confirmation';
  public popoverMessage: string='Êtes-vous sûr de vouloir supprimer ce restaurant?';
  public cancelClicked:boolean=false;
  public confirmClicked:boolean=false;
  editState:boolean=false;
  platToEdit:Plat;
  platForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  id = this.route.snapshot.params['id'];


  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router,
              private _location: Location,
              private platsService: PlatsService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.categorie = new Categorie();
    const id = this.route.snapshot.params['id'];
    this.categoriesService.getSingleCategorie(id).then(
      (categorie: Categorie) => {
        this.categorie = categorie;
      }
    );

    this.platsService.getPlatList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(plats => {
      this.plats = plats;
    });
    this.platsService.getSinglePlat(id).then(
      (plat: Plat) => {
        this.plats = plat;
      }
    );

  }

  onBack() {
    this._location.back();
  }

  onNewPlat(){
    this.router.navigate(['/plats','new',this.route.snapshot.params['id']]);
  }

  onDeletePlat(key, thumb) {
    this.platsService
      .deletePlat(key, thumb)
      .catch(err => console.log(err));
  }

  onViewPlat(id: number) {
    this.router.navigate(['/plats', 'view', id]);
  }


  initForm() {
    this.platForm = this.formBuilder.group({

      title: ['', Validators.required],
      body: ['', Validators.required],
      isFeatured: '',
      tags: '',
      etat:'',
      standardOptions: this.formBuilder.array([this.addStandardOptionsGroup()]),
      extraOptions: this.formBuilder.array([this.addExtraOptionsGroup()]),
      price: this.formBuilder.array([this.addPriceGroup()]),
      pictures: ''
    });
  }

  addStandardOptionsGroup(){
    return this.formBuilder.group({
      nameS:'',
      selectedS:'',
    })
  }

  addExtraOptionsGroup(){
    return this.formBuilder.group({
      nameE:'',
      selectedE:'',
      valueE:''
    })
  }

  addPriceGroup(){
    return this.formBuilder.group({
      nameP:'',
      valueP:'',
      currencyP:''
    })
  }

  get standardOptionsArray(){
    return <FormArray>this.platForm.get('standardOptions');
  }

  addStandardOptions(){
    this.standardOptionsArray.push(this.addStandardOptionsGroup());
  }

  removeStandardOptions(index){
    this.standardOptionsArray.removeAt(index);
  }


  get extraOptionsArray(){
    return <FormArray>this.platForm.get('extraOptions');
  }

  addExtraOptions(){
    this.extraOptionsArray.push(this.addExtraOptionsGroup());
  }

  removeExtraOptions(index){
    this.extraOptionsArray.removeAt(index);
  }

  get priceArray(){

    return <FormArray>this.platForm.get('price');

  }

  addPrice(){
    this.priceArray.push(this.addPriceGroup());
  }

  removePrice(index){
    this.priceArray.removeAt(index);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.platsService.uploadFile(file).then(
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

  editPlat(event, id){
    this.editState = true;
    this.platToEdit = id;
  }

  updatePlat(plat){
    this.plats = new Plat();
    const id = this.route.snapshot.params['id'];
    this.platsService.getSinglePlat(id).then(
      (plat: Plat) => {
        this.plats = plat;
      }
    );

    const standardOptions = this.platForm.get('standardOptions').value;
    const extraOptions = this.platForm.get('extraOptions').value;
    const price = this.platForm.get('price').value;
    const etat = this.platForm.get('etat').value;

    if(this.fileUrl && this.fileUrl !== '') {
      plat.thumb = this.fileUrl;
    }
    this.platsService.updatePlat(plat.key, {
      thumb: plat.thumb,
      title: plat.title,
      body: plat.body,
      etat: plat.etat,
      standardOptions: standardOptions,
      extraOptions: extraOptions,
      price: price,
    });
    this.clearState();
  }

  clearState(){
    this.editState = false;
    this.platToEdit = null;
  }
  toggleMeridian(event, id) {
    this.meridian = !this.meridian;
  }
  toggleEtat() {
    this.etat = !this.etat;
  }


}
