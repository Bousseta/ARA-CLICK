import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RestaurantsService} from "../../services/restaurants.service";
import { map } from 'rxjs/operators';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {Location} from "@angular/common";

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  id_restaurant = this.route.snapshot.params['id'];
  restaurants: any;

  constructor(private route: ActivatedRoute,
              private restaurantsService: RestaurantsService,
              private _location: Location) { }

  ngOnInit() {
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

  arrayOne(n: number): number[] {
    return [...Array(n).keys()];
  }

  public captureScreen()
  {
    var data = document.getElementById('content');
    html2canvas(data).then(canvas => {
// Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/*');
      let pdf = new jspdf('p', 'mm'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, '*', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }
  onBack() {
    this._location.back();
  }


}
