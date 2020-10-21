import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PlatsService} from "../../services/plats.service";
import {Location} from '@angular/common';
import {map} from "rxjs/operators";
import {Plat} from "../../models/plat.model";

@Component({
  selector: 'app-single-plat',
  templateUrl: './single-plat.component.html',
  styleUrls: ['./single-plat.component.scss']
})
export class SinglePlatComponent implements OnInit {

  plat: Plat;
  id = this.route.snapshot.params['id'];

  constructor(private route: ActivatedRoute,
              private platsService: PlatsService,
              private router: Router,
              private _location: Location) {}

  ngOnInit() {
    this.plat = new Plat();
    const id = this.route.snapshot.params['id'];
    this.platsService.getSinglePlat(id).then(
      (plat: Plat) => {
        this.plat = plat;
      }
    );

  }

  onBack() {
    this._location.back();
  }

}
