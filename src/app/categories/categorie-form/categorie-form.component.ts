import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorie } from '../../models/categorie.model';
import { CategoriesService } from '../../services/categories.service';
import { Router,ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.scss']
})
export class CategorieFormComponent implements OnInit {

  categorie: Categorie = new Categorie();

  categorieForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  constructor(private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private route: ActivatedRoute,
              private router: Router,
              private _location: Location) { }

  ngOnInit() {
    this.initForm();
    this.categorie.featured='';
    this.categorie.icon='';
    this.categorie.url='';
  }

  initForm() {
    this.categorieForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: '',
      url: '',
      featured: '',
      icon: '',
      etat:''
    });
  }

  onSaveCategorie() {
    const id_restaurant = this.route.snapshot.params['id'];
    this.categorie.id_restaurant = id_restaurant;
    if(this.fileUrl && this.fileUrl !== '') {
      this.categorie.thumb = this.fileUrl;
    }

    this.categoriesService.createCategorie(this.categorie);
    this._location.back();
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
  onBack() {
    this._location.back();
  }
}

