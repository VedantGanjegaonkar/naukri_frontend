import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  roles: string[] = ['user', 'recruiter'];

  constructor(private fb: FormBuilder, private userService:UserService,private router:Router) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      company: [''],
      qualification: [''],
      branch: ['']
    });

    this.signupForm.get('role')!.valueChanges.subscribe(role => {
      this.onRoleChange(role);
    });
  }

  onRoleChange(role: string) {
    if (role === 'recruiter') {
      this.signupForm.get('company')?.setValidators(Validators.required);
      this.signupForm.get('qualification')?.clearValidators();
      this.signupForm.get('branch')?.clearValidators();
    } else if (role === 'user') {
      this.signupForm.get('company')?.clearValidators();
      this.signupForm.get('qualification')?.setValidators(Validators.required);
      this.signupForm.get('branch')?.setValidators(Validators.required);
    }

    this.signupForm.get('company')?.updateValueAndValidity();
    this.signupForm.get('qualification')?.updateValueAndValidity();
    this.signupForm.get('branch')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      //console.log(this.signupForm.value);
      this.userService.register(this.signupForm.value).subscribe(response=>{
        console.log('signup successful:here is response', response);
        this.router.navigate(['/login']);
      },
    error=>{
      console.error('signupF failed', error);
      
    })
    }
  }
}
