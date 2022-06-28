import { HttpClient } from '@angular/common/http';
import {  Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  submitted =false;
  public signupForm !: FormGroup;
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      userName: ['',[Validators.required, Validators.minLength(6)]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',Validators.required],
    },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword')

    },

    )

  }
  get f() { return this.signupForm.controls; }
  singUp(){
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.httpClient.get<any>('http://localhost:3000/users')
    .subscribe(res => {
      const user = res.find((a:any)=>{
        return a.userName === this.signupForm.value.userName;
      });
    if (user){
      alert('Username already have users');
    }else{
      this.httpClient.post("http://localhost:3000/users", this.signupForm.value)
      .subscribe(res => {
        alert("Signup Successfully");
        this.signupForm.reset();
        this.router.navigate([''])
      })
    }
    },err=>{
      alert("Something went wrong!");
    })

  }

  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors?.['confirmedValidator']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }


}


