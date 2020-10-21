import { Component, OnInit } from '@angular/core';
import {RestaurantsService} from "../services/restaurants.service";
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import {Location} from "@angular/common";

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

  restaurants: any;
  qrForm : FormGroup;

  constructor(private restaurantsService: RestaurantsService,
              private router: Router,
              private formBuilder: FormBuilder) { }

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
    this.qrForm = this.formBuilder.group({
      id_restaurant: ['', Validators.required],
    });
  }

  generateQR(){
    const id_restaurant = this.qrForm.get('id_restaurant').value;
    this.router.navigate(['/pdf', id_restaurant]);
  }

  onBack() {
    this.router.navigate(['/dashboard']);
  }
}
