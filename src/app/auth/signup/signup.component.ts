import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfilService} from "../../services/profil.service";
import { Router } from '@angular/router';
import {Profil} from "../../models/profil.model";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;
  profil: Profil = new Profil();
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nom: '',
      cin: '',
      address: '',
      mobile: '',
      fixe: '',
      confirmpasswd:'',
    });
  }

  onSubmit() {
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    this.authService.createNewUser(email, password).then(
        () => {
          this.router.navigate(['/restaurants']);
        },
        (error) => {
          this.errorMessage = error;
        }
    );

    this.authService.createProfil(this.profil);
    this.profil = new Profil();
  }

}
