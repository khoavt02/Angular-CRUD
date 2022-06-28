import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  public loginForm !: FormGroup;
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.loginForm =this.formBuilder.group({
      userName: ['',Validators.required],
      password: ['',Validators.required]
    })

  }
  get f() { return this.loginForm.controls; }

  Login(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.httpClient.get<any>('http://localhost:3000/users')
      .subscribe(res => {
        const user = res.find((a:any)=>{
          return a.userName === this.loginForm.value.userName && a.password === this.loginForm.value.password
        });
      if (user){
        localStorage.setItem('username', this.loginForm.value.userName);
        localStorage.setItem('userNameLogin', this.loginForm.value.userName)

        alert("Login Successful");
        this.loginForm.reset();
        this.router.navigate(['dashboard'])


      }else{
        alert("User not found!")
      }
      },err=>{
        alert("Something went wrong!");
      })
  }
}
