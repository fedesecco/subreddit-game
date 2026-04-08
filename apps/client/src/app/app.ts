import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataServce } from '@services/data.service';

@Component({
  imports: [RouterModule],
  selector: 'sr-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly dataService = inject(DataServce);
}
