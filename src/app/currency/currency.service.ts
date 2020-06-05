import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

type PayloadJSON = {
  time: {
    updated: string;
    updatedISO: string;
    updateduk: string;
  };
  bpi: {
    [key in 'USD' | 'BRL']: {
      code: string;
      rate: string;
      description: string;
      rate_float: number;
    };
  };
};

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  // 1. Devolver a cotação atual do Bitcoin
  // url == 'https://api.coindesk.com/v1/bpi/currentprice/BRL.json' - Check

  // 2. Guardar as cotações que forem diferentes da atual

  /**
   * Cotação mais atual
   */
  private currentCurrency;

  /**
   * Armazena as cotações passadas
   */
  private pastCurrencies = [];

  private oldCurrencies = [
    {
      date: '',
      currency: '',
    },
  ];

  public caixa = 1000;

  public indexCurrency;

  private timer: any;

  /**
   * Determina a cotação atual
   */
  private requestCurrencyBitcoin() {
    if (!this.timer) {
      let i = 0;
      this.timer = setInterval(() => {
        this.douglas
          .get<PayloadJSON>(
            'https://api.coindesk.com/v1/bpi/currentprice/BRL.json'
          )
          .subscribe((data) => {
            // Cotação retornada em dólar
            const usd_currency = data.bpi.USD.rate_float;

            // Última registrada
            const lastCurrency =
              this.pastCurrencies[this.pastCurrencies.length - 1] || 1;

            // Verifica se cotação atual é diferente do valor da última
            if (usd_currency !== lastCurrency) {
              if (this.pastCurrencies.length > 0) {
                // Então, a cotação atual será o divisor da relação
                this.indexCurrency = (usd_currency / lastCurrency - 1) * 100;
              }

              // Registra a cotação atual
              this.pastCurrencies.push(usd_currency);
            }

            i++;

            // Registra a data e o valor retornado pela requisição
            this.oldCurrencies.push({
              date: data.time.updated,
              currency: data.bpi.USD.rate + i,
            });

            // Define a cotação atual
            this.currentCurrency = usd_currency;
          });
      }, 1000);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Acessa o atributo `currentCurrency`
   */
  getCurrentCurrency() {
    return this.currentCurrency;
  }

  getPastCurrencies() {
    return this.pastCurrencies;
  }

  getOldCurrencies() {
    return this.oldCurrencies;
  }

  constructor(private douglas: HttpClient) {
    this.requestCurrencyBitcoin();
  }
}
