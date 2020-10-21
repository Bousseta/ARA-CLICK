import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Profil} from "../models/profil.model";
import {ProfilService} from "../services/profil.service";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {


  profil: Profil;
  id = this.route.snapshot.params['id'];

  constructor(private route: ActivatedRoute,
              private profilService: ProfilService,
              private router: Router,
              private _location: Location) {}

  ngOnInit() {
    this.profil = new Profil();
    const id = this.route.snapshot.params['id'];
    this.profilService.getSingleProfil(id).then(
      (profil: Profil) => {
        this.profil = profil;
      }
    );

  }

  onBack() {
    this._location.back();
  }

}
