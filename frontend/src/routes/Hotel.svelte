<script>
	import Button from '@smui/button';
	import Slider from '@smui/slider';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Select, { Option } from '@smui/select';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Textfield from '@smui/textfield';
	import CircularProgress from '@smui/circular-progress';
	import Card, { Content, PrimaryAction, Media, MediaContent } from '@smui/card';
	import { offers, hotel } from './stores';
	import { fetchOffers } from './api';
	import Offer from './Offer.svelte';

	export let hotelId;
	export let name;
	export let category_stars;
	export let city;
	export let minPrice;
	export let offersCount;
	export let state;

	export let activeHotel;
	$: active = $activeHotel === hotelId;
	$: loading = $offers !== null && $offers.length === 0;
	function pressed() {
		if ($activeHotel === hotelId) {
			$activeHotel = null;
		} else {
			$activeHotel = hotelId;
			fetchOffers();
		}
	}
</script>

<div class:active class="card-container" style="width: 400px; margin: 2rem; background-color: var(--mdc-theme-surface, #212125);">
	<div class="column">
		<Card style="width: 400px;">
			<div style="padding: 1rem;">
				<div class="row">
					<h2 class="mdc-typography--headline6" style="margin: 0;">{name}</h2>

					<h3 class="mdc-typography--headline6" style="margin: 0;">
						{#each Array(category_stars) as _}⭐{/each}
					</h3>
				</div>
				<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">{city ? city : state}</h3>
			</div>
			<PrimaryAction on:click={pressed}>
				<Media class="card-media-16x9" aspectRatio="16x9" style="background-image: url('./hotel.jpg');" />
				<Content class="mdc-typography--body2">
					<div style="display: flex; justify-content: space-between;">
						<div style="display: flex; justify-content: space-between;">
							<h3 class="mdc-typography--subtitle2" style="margin: 0.3rem;">{offersCount} Angebot{offersCount > 1 ? 'e' : ''}</h3>
						</div>
						<div>
							<h3 class="mdc-typography--subtitle2" style="margin: 0;">Ab {minPrice} €</h3>
						</div>
					</div>
				</Content>
			</PrimaryAction>
		</Card>
		{#if active}
			{#if loading && !$offers && !$hotel}
				<div style="display: flex; justify-content: center; margin: 2rem;">
					<CircularProgress style="height: 32px; width: 32px;" indeterminate />
				</div>
			{:else}
				<div class="row detailRow">
					<Icon class="material-icons">place</Icon>
					<div>
						{#if $hotel}
							<a class="detailRowRight" href="https://www.google.com/maps/search/{$hotel.formattedAddress}/@{$hotel.latitude},{$hotel.longitude},15z">
								{#if $hotel.streetName || $hotel.streetNumber}
									{$hotel.streetName || ''} {$hotel.streetNumber || ''}<br />
								{/if}
								{#if $hotel.zipcode || $hotel.city}
									{$hotel.zipcode || ''} {$hotel.city || ''}<br />
								{/if}
								{#if $hotel.state}
									{$hotel.state}<br />
								{/if}
								{#if $hotel.country}
									{$hotel.country}
								{/if}
							</a>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</div>
	{#if active}
		<div class="column" style="width: 100%;">
			<h3 style="padding-left: 2rem;">Angebote</h3>
			{#if loading && !$offers && !$hotel}
				<div style="display: flex; justify-content: center; margin: 2rem;">
					<CircularProgress style="height: 32px; width: 32px;" indeterminate />
				</div>
			{:else if $offers}
				{#each $offers as offer}
					<Offer {...offer} />
				{:else}
					Keine Angebote gefunden
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
	}
	.active {
		min-width: calc(100% - 12rem);
		display: flex;
		flex-direction: row;
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.detailRow {
		display: grid;
		align-items: center;
		width: 400px;
		box-sizing: border-box;
		justify-content: flex-start;
		padding: 2rem;
		grid-template-columns: 1fr 3fr;
	}
	a {
		text-decoration: none;
		color: var(--mdc-theme-secondary, rgb(2, 113, 194));
	}
	a:hover {
		text-decoration: underline;
	}
</style>
