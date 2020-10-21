import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Plat } from '../../models/plat.model';
import { standardOptions } from '../../models/standardOptions.model';
import { PlatsService } from '../../services/plats.service';
import { Router,ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";


@Component({
  selector: 'app-plat-form',
  templateUrl: './plat-form.component.html',
  styleUrls: ['./plat-form.component.scss']
})
export class PlatFormComponent implements OnInit {
  meridian = true ;
  etat = true ;

  plat: Plat = new Plat();

  platForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  constructor(private formBuilder: FormBuilder,
              private platsService: PlatsService,
              private route: ActivatedRoute,
              private router: Router,
              private _location: Location
  ) { }

  ngOnInit() {
    this.initForm();
    this.plat.tags = '';
    this.plat.isFeatured='';
    this.plat.pictures='';
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
      pictures: '',

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

  onSavePlat() {
    const category = this.route.snapshot.params['id'];
    this.plat.category = category;
    if(this.fileUrl && this.fileUrl !== '') {
      this.plat.thumb = this.fileUrl;
    }

    const standardOptions = this.platForm.get('standardOptions').value;
    const extraOptions = this.platForm.get('extraOptions').value;
    const price = this.platForm.get('price').value;
    const etat = this.platForm.get('etat').value;
    this.plat.etat = etat;
    this.plat.standardOptions = standardOptions;
    this.plat.extraOptions = extraOptions;
    this.plat.price = price;

    this.platsService.createPlat(this.plat);
    this.router.navigate(['/categories','view',category]);
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
  toggleMeridian() {
    this.meridian = !this.meridian;
  }
  toggleEtat() {
    this.etat = !this.etat;
  }
  onBack() {
    this._location.back();
  }
}
