import { test, expect } from '@playwright/test';
import * as oneTradingApi from './api/oneTradingApi.ts';
import { instrumentStatus } from './api/status.ts';

test('should return list of currencies', async ({ request }) => {
  const currencies = await request.get('public/v1/currencies');

  expect(currencies.status()).toBe(200);
  expect(await currencies.json()).toContainEqual(expect.objectContaining({
    code: 'BTC',
    precision: 8
  }));
});

test('should return list of active instruments', async ({ request }) => {
  const activeInstruments = await oneTradingApi.getInstrumentByStatus(request, instrumentStatus.ACTIVE);

  activeInstruments.forEach((instrument: any) => {
    expect(instrument).toEqual(expect.objectContaining({
      state: 'ACTIVE'
    }));
  });
});

test('should return instrument by code', async ({ request }) => {
  const instrument = await oneTradingApi.getInstrumentByCode(request, 'BTC', 'EUR');

  expect(instrument).toEqual(expect.objectContaining({
    base: {
      code: 'BTC',
      precision: 8
    },
    quote: {
      code: 'EUR',
      precision: 2
    }
  }));
});

test('should return instrument order book', async ({ request }) => {
  const orderBook = await oneTradingApi.getInstrumentOrderBook(request, 'BTC_GBP');

  expect(orderBook).toEqual(expect.objectContaining({
    bids: expect.any(Array),
    asks: expect.any(Array)
  }));
});

test('should return market ticker for instrument', async ({ request }) => {
  const marketTicker = await oneTradingApi.getMarketTickerForInstrument(request, 'BTC_EUR');

  expect(marketTicker).toEqual(expect.objectContaining({
    instrument_code: 'BTC_EUR'
  }));
});

test('should return invalid instrument code for market ticker', async ({ request }) => {
  const marketTicker = await oneTradingApi.getMarketTickerForInstrument(request, 'EUROC_XEM');

  expect(marketTicker).toEqual(expect.objectContaining({
    error: 'INVALID_INSTRUMENT_CODE'
  }));
});

test('should get market ticker for instruments list', async ({ request }) => {
  const instruments = await oneTradingApi.getInstruments(request);
  for (const instrument of instruments) {
    if (instrument === 'XRP_EUR') {
      const orderBook = await oneTradingApi.getMarketTickerForInstrument(request, instrument);
      console.log(orderBook);
      expect(orderBook).toEqual(expect.objectContaining({
        instrument_code: instrument
      }));
    }
  };
});