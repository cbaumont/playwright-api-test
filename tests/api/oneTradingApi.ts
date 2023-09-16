import { APIRequestContext } from "@playwright/test";

export async function getInstrumentByStatus(request: APIRequestContext, status = 'ACTIVE') {
	const intruments = await request.get('public/v1/instruments');

	const activeInstruments = await intruments.json().then((response: any) => {
		return response.filter((instrument: any) => instrument.state === status)
	});
	console.log(activeInstruments);
	return activeInstruments;
};

export async function getInstrumentByCode(request: APIRequestContext, baseCode: string, quoteCode: string) {
	const intruments = await request.get('public/v1/instruments');

	const instrument = await intruments.json().then((response: any) => {
		return response.filter((instrument: any) => instrument.base.code === baseCode && instrument.quote.code === quoteCode)
	});
	console.log(instrument);
	return instrument[0];
}

export async function getInstrumentOrderBook(request: APIRequestContext, instrumentCode: string) {
	const orderBook = await (await request.get(`public/v1/order-book/${instrumentCode}`)).json();

	console.log(orderBook);
	return orderBook;
}

export async function getCurrencies(request: APIRequestContext) {
	const currencies = await request.get('public/v1/currencies');

	return await currencies.json().then((response: any) => response.map((currency: any) => {
		return currency.code;
	}));
}

export async function getMarketTickerForInstrument(request: APIRequestContext, instrumentCode: string) {
	const marketTicket = await request.get(`public/v1/market-ticker/${instrumentCode}`);

	return await marketTicket.json();
}

export async function getInstruments(request: APIRequestContext) {
	const currencies = await getCurrencies(request);
	const instruments: string[] = [];
	for (let i = 0; i < currencies.length; i++) {
		for (let j = 1; j < currencies.length; j++) {
			const instrument = `${currencies[i]}_${currencies[j]}`;
			instruments.push(instrument);
		}
	}
	return instruments;
}