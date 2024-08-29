import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'simple-quick';
  currentRoute!: string;
  constructor(
    private _router: Router,
    private _httpService: HttpClient
  ) {
    // this.currentRoute = this._activeRoute.snapshot.data['currentRoute'] === 'inbox' ? 'inbox' : 'task';
  }

  ngOnInit() {
  }
  /**
     * Changes Route
     *
     * @param route
     */
  public navigateTo(route: string): void {
    this._router.navigate([route]);
    this.currentRoute = route
  }
}
