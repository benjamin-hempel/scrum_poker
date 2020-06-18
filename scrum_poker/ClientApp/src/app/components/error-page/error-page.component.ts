import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  public errorMessage: string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.errorMessage = this.route.snapshot.paramMap.get("cause");
    if (this.errorMessage == null)
      this.errorMessage = "default";
  }

  faExclamationCircle = faExclamationCircle;
}
