// import {
//   afterNextRender,
//   Component,
//   DestroyRef,
//   inject,
//   viewChild,
// } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { debounceTime } from 'rxjs';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {
//   private form = viewChild.required<NgForm>('form');
//   private destroyRef = inject(DestroyRef);

//   constructor() {
//     afterNextRender(() => {
//       const savedForm = window.localStorage.getItem('saved-login-form');
//       if (savedForm) {
//         const loadedFormData = JSON.parse(savedForm);
//         const savedEmail = loadedFormData.email();

//         setTimeout(() => {
//           this.form().controls['email'].setValue(savedEmail);
//         }, 1);
//       }

//       const subscription = this.form()
//         .valueChanges?.pipe(debounceTime(500))
//         .subscribe({
//           next: (value) =>
//             window.localStorage.setItem(
//               'saved-login-form',
//               JSON.stringify({ email: value.email })
//             ),
//         });
//       this.destroyRef.onDestroy(() => {
//         subscription?.unsubscribe();
//       });
//     });
//   }

//   onSubmit(formData: NgForm) {
//     if (formData.form.valid) {
//       return;
//     }

//     const enteredEmail = formData.form.value.email;
//     const enteredPassword = formData.form.value.password;

//     formData.form.reset();
//   }
// }

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.invalid &&
      this.form.controls.email.dirty
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.invalid &&
      this.form.controls.password.dirty
    );
  }

  ngOnInit() {
    const savedForm = window.localStorage.getItem('saved-login-form');
          if (savedForm) {
            const loadedForm = JSON.parse(savedForm);
            this.form.patchValue({ 
              email: loadedForm.email
            })
          }

    
   const subscription =  this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem(
          'saved-login-form',
          JSON.stringify({ email: value.email })
        );
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
  }
}
