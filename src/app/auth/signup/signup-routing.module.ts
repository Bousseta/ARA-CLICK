import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';

const routes: Routes = [
    {
        path: '/signup', component: SignupComponent,

    }
];

@NgModule({
    imports: [],
    exports: [RouterModule]
})
export class SignupRoutingModule {
}
