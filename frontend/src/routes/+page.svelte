<script>
	import Button from '@smui/button';
	import Slider from '@smui/slider';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Select, { Option } from '@smui/select';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Textfield from '@smui/textfield';
	import Card, { Content, PrimaryAction, Actions, ActionButtons, ActionIcons } from '@smui/card';
	import { writable } from 'svelte/store';
	import Hotel from './Hotel.svelte';

	let mealTypes = [
		'none',
		'allinclusive',
		'breakfast',
		'halfboard',
		'fullboard',
		'halfboardplus',
		'allinclusiveplus',
		'selfcatering',
		'fullboardplus',
		'program'
	];
	let tabs = [
		{
			icon: 'near_me',
			label: 'Flight & Hotel'
		},
		{
			icon: 'flight',
			label: 'Flight'
		},
		{
			icon: 'hotel',
			label: 'Hotel'
		}
	];
	let active = tabs[0];

	let destinationAirport = 'PMI';
	let homeAirport = 'HAM';
	let departureDate = '2022-08-13T14:50:00.000Z';
	let returnDate = '2022-08-16T07:55:00.000Z';
	let adults = 1;
	let children = 0;

	const hotels = writable([]);

	async function search() {
		console.log('searching...');
		let response = await fetch('http://localhost:8080/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				destinationAirport,
				homeAirport,
				departureDate,
				returnDate,
				adults,
				children
			})
		});
		if (response.ok) {
			$hotels = (await response.json()).hotels;
			console.log('Found', $hotels);
		} else {
			console.log('Error', response);
		}
	}
</script>

<div class="searchBox" style="max-width: 80%; margin: 1rem auto;">
	<h1>Find your perfect holiday</h1>
	<TabBar {tabs} let:tab bind:active>
		<Tab {tab}>
			<Icon class="material-icons">{tab.icon}</Icon>
			<Label>{tab.label}</Label>
		</Tab>
	</TabBar>

	<Card style="margin: 1rem auto; max-width: 800px;">
		<div style="padding: 1rem;">
			<h2 class="mdc-typography--headline6" style="margin: 0;">Search your flight</h2>
			<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">And a subtitle.</h3>
		</div>
		<Content>
			<FormField style="display: flex; flex-direction: column; min-width: 600px;">
				<div class="row">
					<Textfield type="text" bind:value={destinationAirport} label="Your destination airport" style="min-width: 250px; margin: 1rem;" />
					<Textfield type="text" bind:value={homeAirport} label="Your home airport" style="min-width: 250px; margin: 1rem;" />
				</div>
				<div class="row">
					<Textfield type="date" bind:value={departureDate} label="Departure Date" style="min-width: 250px; margin: 1rem;" />
					<Textfield type="date" bind:value={returnDate} label="Return Date" style="min-width: 250px; margin: 1rem;" />
				</div>
				<div class="row">
					<span>Number of Adults</span>
					<Slider bind:value={adults} min={1} max={8} style="width: 250px;" />
					<span>{adults}</span>
				</div>
				<div class="row">
					<span>Number of Children</span>
					<Slider bind:value={children} min={0} max={8} style="width: 250px;" />
					<span>{children}</span>
				</div>
			</FormField>
		</Content>
		<Actions>
			<Button on:click={search}>
				<Label>Search</Label>
			</Button>
		</Actions>
	</Card>

	{#if $hotels.length > 0}
		<h2>{$hotels.length} Offers</h2>
		<div class="offersBox">
			{#each $hotels as hotel}
				<Hotel {...hotel} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 600px;
	}
	span {
		margin: 1rem;
		width: 150px;
		text-align: left;
	}
	.offersBox {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
	}
</style>
