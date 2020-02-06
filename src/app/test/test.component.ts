import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"]
})
export class TestComponent implements OnInit {
  personForm: FormGroup;
  successfulSave: boolean;
  errors: string[];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.personForm = this.fb.group({
      title: ["", Validators.required],
      firstName: ["", Validators.required],
      surname: ["", Validators.required],
      emailAddress: ["", Validators.required]
    });
    this.errors = [];
  }

  onSubmit() {
    if (this.personForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      };
      let person = {
        title: this.personForm.value.title,
        firstName: this.personForm.value.firstName,
        surname: this.personForm.value.surname,
        emailAddress: this.personForm.value.emailAddress
      };
      this.errors = [];
      console.log("submit");

      this.http
        .get("/assets/person.json", { responseType: "text" })
        .pipe(
          tap(data => {
            console.log("data", data);
            //if (err.status === 400) {
            // handle validation error
            let validationErrorDictionary = JSON.parse(data);
            console.log("dictionary", validationErrorDictionary);
            for (var fieldName in validationErrorDictionary) {
              if (validationErrorDictionary.hasOwnProperty(fieldName)) {
                if (this.personForm.controls[fieldName]) {
                  this.personForm.controls[fieldName].setErrors({
                    invalid: true
                  });
                } else {
                  this.errors.push(validationErrorDictionary[fieldName]);
                }
              }
            }
          })
        )
        .subscribe();
    }
  }
}
