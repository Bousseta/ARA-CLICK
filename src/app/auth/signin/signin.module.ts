import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SigninRoutingModule } from './signin-routing.module';
import {SigninComponent} from "./signin.component";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SigninRoutingModule
  ],
  declarations: []
})
export class SigninModule { }
