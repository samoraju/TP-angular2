import { Component, OnInit } from '@angular/core';

import { CurrencyService } from './currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  // styleUrls: ['./currency.component.css'],
})
export class CurrencyComponent implements OnInit {
  constructor(public currencyService: CurrencyService) {}

  ngOnInit(): void {}
}
