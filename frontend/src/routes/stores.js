import { writable } from 'svelte/store';

export let destinationAirport = writable('PMI');
export let homeAirport = writable('HAM');
export let departureDate = writable('2022-08-23');
export let returnDate = writable('2022-08-30');
export let adults = writable(2);
export let children = writable(1);

export let additionalFilters = writable(false);
export let minPrice = writable(0);
export let maxPrice = writable(12000);
export let minStars = writable(1);
export let maxStars = writable(5);
export let exactDate = writable(false);

export const hotels = writable(null);
export const activeHotel = writable(null);
export const offers = writable(null);
export const hotel = writable(null);
