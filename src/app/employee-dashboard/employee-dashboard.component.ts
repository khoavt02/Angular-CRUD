import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EmployeeModel } from './employee-dashboard.model';
import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  userNameLogin = localStorage.getItem('userNameLogin');
  data!:string;
  submitted = false;
  formValue !: FormGroup;
  employeeData !: any;
  employeeObj : EmployeeModel = new EmployeeModel();
  showAdd !: boolean;
  showUpdate !: boolean;
  @Input() receive !: string;
  @Input() mobileSpecification !: any;
  // role:string ="";
  page: number = 1;
  count: number = 0;
  tableSize: number = 6;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private api: ApiService,
    private formBuilder: FormBuilder, private httpClient: HttpClient) { }


  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile: ['',[Validators.required, Validators.minLength(10)]]
    }
    )
    this.getAllEmployee();
    // this.role = localStorage.getItem('userType')!
  }



  get f() { return this.formValue.controls; }



  clickAddEmployee(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
    console.log(this.employeeData);

  }
  postEmployeeDetails() {
    this.submitted = true;
    if (this.formValue.invalid) {
      return;
    }

    this.employeeObj.FirstName = this.formValue.value.firstName;
    this.employeeObj.LastName = this.formValue.value.lastName;
    this.employeeObj.Email = this.formValue.value.email;
    this.employeeObj.Mobile = this.formValue.value.mobile;
    this.api.PostEmployee(this.employeeObj)
      .subscribe(res => {
        console.log(res);
        let ref = document.getElementById('close');
        ref?.click();
        this.getAllEmployee();
      })
  }
 getAllEmployee(){
   this.api.GetEmployees()
     .subscribe(res =>{
       this.employeeData = res;
     })
 }
  getEmployeeDetails() {
    this.api.GetEmployees()
    .subscribe(res=>{
      this.employeeData = res.employeeDetails;

    })
  }
  editEmployeeDetail(){
    this.submitted = true;
    if (this.formValue.invalid) {
      return;
    }
     this.employeeObj.FirstName = this.formValue.value.firstName;
     this.employeeObj.LastName = this.formValue.value.lastName;
     this.employeeObj.Email = this.formValue.value.email;
     this.employeeObj.Mobile = this.formValue.value.mobile;
    this.api.UpdateEmployee(this.employeeObj, this.employeeObj.Id)
    .subscribe(res=>{
      alert("Updated Successfully")
      let ref = document.getElementById('close');
      ref?.click();
      this.getAllEmployee();

    })
  }
  onEdit(row : any){
    this.employeeObj.Id = row.id;
    this.formValue.controls['firstName'].setValue(row.FirstName);
    this.formValue.controls['lastName'].setValue(row.LastName);
    this.formValue.controls['email'].setValue(row.Email);
    this.formValue.controls['mobile'].setValue(row.Mobile);
    this.showUpdate = true;
    this.showAdd = false;
  }

  deleteEmployeeDetail(row : any){
   let clickedYes = confirm("Are you sure want to delete");
   if(clickedYes){
    this.api.DeleteEmployee(row.id)
    .subscribe(res=>{
      alert("Deleted Successfully");
      this.getAllEmployee();
    })
   }
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  clickLogout(){
    localStorage.removeItem('username');
  }


}
