import { get } from 'svelte/store';
import {
	destinationAirport,
	homeAirport,
	departureDate,
	returnDate,
	adults,
	children,
	additionalFilters,
	minPrice,
	maxPrice,
	minStars,
	maxStars,
	hotels,
	activeHotel,
	offers,
	hotel,
	exactDate
} from './stores';

function getSearchQuery() {
	let data = {
		destinationAirport: get(destinationAirport),
		homeAirport: get(homeAirport),
		departureDate: get(departureDate),
		returnDate: get(returnDate),
		adults: get(adults),
		children: get(children)
	};
	if (get(additionalFilters)) {
		data.minPrice = get(minPrice);
		data.maxPrice = get(maxPrice);
		data.minStars = get(minStars);
		data.maxStars = get(maxStars);
		data.exactDate = get(exactDate);
	}
	return data;
}

export async function fetchHotels() {
	let data = getSearchQuery();
	console.log('searching with', data);
	let response = await fetch('http://localhost:8080/hotels', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify(data)
	});
	if (response.ok) {
		hotels.set([]);
		hotels.set((await response.json()).hotels);
		console.log('Found', get(hotels));
	} else {
		console.log('Error', response);
	}
}

export async function fetchOffers() {
	let data = {
		...getSearchQuery(),
		hotelId: get(activeHotel)
	};
	console.log('searching with', data);
	let response = await fetch('http://localhost:8080/offers', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify(data)
	});
	if (response.ok) {
		const body = await response.json();
		body.offers.forEach((offer) => {
			offer.departureDate = new Date(offer.departureDate);
			offer.returnDate = new Date(offer.returnDate);
			offer.inboundArrivalDatetime = new Date(offer.inboundArrivalDatetime);
			offer.outboundArrivalDatetime = new Date(offer.outboundArrivalDatetime);
		});
		offers.set(body.offers);
		hotel.set(body.hotel);
		console.log('Found offers', get(offers));
		console.log('Found hotel', get(hotel));
	} else {
		console.log('Error', response);
	}
}
