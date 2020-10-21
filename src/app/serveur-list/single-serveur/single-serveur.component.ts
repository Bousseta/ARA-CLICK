import { Component, OnInit } from '@angular/core';
import { Serveur } from '../../models/serveur.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServeursService } from '../../services/serveurs.service';
import {RestaurantsService} from "../../services/restaurants.service";
import { map } from 'rxjs/operators';
import {Location} from "@angular/common";



@Component({
  selector: 'app-single-serveur',
  templateUrl: './single-serveur.component.html',
  styleUrls: ['./single-serveur.component.scss']
})
export class SingleServeurComponent implements OnInit {

  serveur: Serveur;
  restaurants: any;
  id = this.route.snapshot.params['id'];

  constructor(private route: ActivatedRoute,
              private serveursService: ServeursService,
              private router: Router,
              private restaurantsService: RestaurantsService,
              private _location: Location) {}

  ngOnInit() {
    this.serveur = new Serveur();
    const id = this.route.snapshot.params['id'];
    this.serveursService.getSingleServeur(id).then(
      (serveur: Serveur) => {
        this.serveur = serveur;
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

  onBack() {
    this._location.back();
  }

}
