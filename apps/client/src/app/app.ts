import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataServce } from '@services/data.sevice';

@Component({
  imports: [RouterModule, JsonPipe],
  selector: 'sr-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly dataService = inject(DataServce);
}
