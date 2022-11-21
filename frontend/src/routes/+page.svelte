<script>
	import Button from '@smui/button';
	import Slider from '@smui/slider';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Tab, { Icon, Label } from '@smui/tab';
	import CircularProgress from '@smui/circular-progress';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import TabBar from '@smui/tab-bar';
	import Textfield from '@smui/textfield';
	import Snackbar, { Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
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
		exactDate,
		hotels,
		activeHotel
	} from './stores';
	import { onMount } from 'svelte';
	import Hotel from './Hotel.svelte';
	import { fetchHotels } from './api';

	let tabs = [
		{
			icon: 'near_me',
			label: 'Flight & Hotel Booking'
		}
	];
	let active = tabs[0];
	let searching = false;
	let snackbar;
	let openSnackbar = function () {};
	onMount(() => {
		openSnackbar = function () {
			console.log(snackbar);
			if (snackbar.isOpen) {
				snackbar.close();
			}
			snackbar.open();
		};
	});

	activeHotel.subscribe((hotel) => {
		console.log('activeHotel', hotel);
	});

	hotels.subscribe((hotels) => {
		searching = false;
		openSnackbar();
	});
</script>

<div class="searchBox" style="max-width: 80%; margin: 1rem auto;">
	<TabBar {tabs} let:tab bind:active>
		<Tab {tab}>
			<Icon class="material-icons">{tab.icon}</Icon>
			<Label>{tab.label}</Label>
		</Tab>
	</TabBar>

	<FormField style="display: flex; flex-direction: column; min-width: 600px; margin: 2rem;">
		<Accordion multiple>
			<Panel nonInteractive open>
				<Header>Your trip</Header>
				<Content>
					<div class="row">
						<Textfield type="text" bind:value={$destinationAirport} label="Your destination airport" style="min-width: 250px; margin: 1rem;" />
						<Textfield type="text" bind:value={$homeAirport} label="Your home airport" style="min-width: 250px; margin: 1rem;" />
					</div>
					<div class="row">
						<Textfield type="date" bind:value={$departureDate} label="Departure Date" style="min-width: 250px; margin: 1rem;" />
						<Textfield type="date" bind:value={$returnDate} label="Return Date" style="min-width: 250px; margin: 1rem;" />
					</div>
					<div class="rowSlider">
						<span>Number of Adults</span>
						<Slider bind:value={$adults} min={1} max={8} style="width: 300px;" />
						<span>{$adults}</span>
					</div>
					<div class="rowSlider">
						<span>Number of Children</span>
						<Slider bind:value={$children} min={0} max={8} style="width: 300px;" />
						<span>{$children}</span>
					</div>
				</Content>
			</Panel>
			<Panel>
				<Header on:click={() => ($additionalFilters = !$additionalFilters)}>
					<div class="row" style="justify-content: space-between; user-select: none;">
						Additional Filter
						<Checkbox bind:checked={$additionalFilters} />
					</div>
				</Header>
				<Content>
					<div class="row">
						<span>Use exact departure and return date</span>
						<Checkbox bind:checked={$exactDate} />
					</div>
					<div class="rowSliderBig">
						<span>Star Range</span>
						<span style="text-align: right; margin-left: 0; margin-right: 1rem;"> {$minStars} </span>
						<Slider range bind:start={$minStars} bind:end={$maxStars} min={1} max={5} step={1} style="width: 300px;" />
						<span> {$maxStars} </span>
					</div>
					<div class="rowSliderBig">
						<span>Price Range</span>
						<span style="text-align: right; margin-left: 0; margin-right: 1rem;"> {$minPrice} </span>
						<Slider range bind:start={$minPrice} bind:end={$maxPrice} min={0} max={12000} step={1} style="width: 300px;" />
						<span> {$maxPrice} </span>
					</div>
				</Content>
			</Panel>
		</Accordion>
	</FormField>

	<div style="display: flex; width: 100%; justify-content: center;">
		{#if searching}
			<div style="display: flex; justify-content: center;">
				<CircularProgress style="height: 32px; width: 32px;" indeterminate />
			</div>
		{:else}
			<Button
				on:click={() => {
					searching = true;
					fetchHotels();
				}}
				variant="raised"
			>
				<Label>Search</Label>
			</Button>
		{/if}
	</div>

	{#if $hotels}
		<div class="hotelsBox">
			{#each $hotels as hotel}
				<Hotel {activeHotel} {...hotel} />
			{/each}
		</div>
	{/if}
	<Snackbar bind:this={snackbar}>
		{#if $hotels}
			<Label>
				Found {$hotels.length} Hotels.
				{#if $hotels.length <= 0}
					Adjust your search criteria.
				{/if}
			</Label>
		{/if}
		<Actions>
			<IconButton class="material-icons" title="Dismiss">close</IconButton>
		</Actions>
	</Snackbar>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 600px;
	}
	.rowSlider,
	.rowSliderBig {
		display: grid;
		grid-template-columns: 2fr 4fr 1fr;
		width: 600px;
	}
	.rowSliderBig {
		grid-template-columns: 2fr 1.5fr 5fr 1.7fr;
	}
	span {
		margin-left: 1rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	.hotelsBox {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
	}
</style>
