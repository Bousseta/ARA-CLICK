import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer.model";
import {Input} from '@angular/core';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  @Input() customer: Customer;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
  }

  updateActive(isActive: boolean) {
    this.customerService
        .updateCustomer(this.customer.key, { active: isActive })
        .catch(err => console.log(err));
  }

  deleteCustomer() {
    this.customerService
        .deleteCustomer(this.customer.key)
        .catch(err => console.log(err));
  }

}
