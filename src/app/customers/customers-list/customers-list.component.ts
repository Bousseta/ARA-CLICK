import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {

  customers: any;

  constructor(private customerService: CustomerService,private router: Router) { }

  ngOnInit() {
    this.getCustomersList();
  }

  getCustomersList() {
    this.customerService.getCustomersList().snapshotChanges().pipe(
        map(changes =>
            changes.map(c =>
                ({ key: c.payload.key, ...c.payload.val() })
            )
        )
    ).subscribe(customers => {
      this.customers = customers;
    });
  }

  deleteCustomers() {
    this.customerService.deleteAll().catch(err => console.log(err));
  }

  onNewCustomer() {
    this.router.navigate(['/customers', 'new']);
  }

}
