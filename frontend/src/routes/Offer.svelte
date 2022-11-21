<script>
	import Paper, { Title, Content } from '@smui/paper';
	import { Icon, Label } from '@smui/common';
	import { calculatePrice } from './util';
	import Button from '@smui/button';
	export let adults;
	export let children;
	export let departureDate;
	export let hotelId;
	export let inboundAirline;
	export let inboundArrivalAirport;
	export let inboundArrivalDatetime;
	export let inboundDepartureAirport;
	export let mealtype;
	export let oceanview;
	export let outboundAirline;
	export let outboundArrivalAirport;
	export let outboundArrivalDatetime;
	export let outboundDepartureAirport;
	export let price;
	export let returnDate;
	export let roomtype;

	const { adultsPrices, childrenPrices } = calculatePrice(price, adults, children);
	const optionsDate = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
	const optionsTime = { hour: 'numeric', minute: 'numeric' };
</script>

<div class="outer">
	<Paper color="secondary">
		<Content>
			<div class="grid">
				<div class="column flight">
					<div class="outgoing">
						<div class="row">
							<Icon class="material-icons">flight_takeoff</Icon>
							<span style="font-weight: 700; padding-left: 0.3rem;">
								{departureDate.toLocaleDateString('de-DE', optionsDate)}
							</span>
						</div>
						<div class="row">
							<span style="">
								{departureDate.toLocaleTimeString('de-DE', optionsTime)}
							</span>
							<span style="padding-left: 1rem;">
								{outboundDepartureAirport}
							</span>
						</div>
						<div class="row">
							<div style="padding-left: 0.57rem;" />
							<Icon class="material-icons">south</Icon>
							<div style="color: #ccc">
								<span style="padding-left: 1.6rem;">
									{new Date(outboundArrivalDatetime.getTime() - departureDate.getTime()).toLocaleTimeString('de-DE', optionsTime)}
								</span>
								&nbsp; | &nbsp;
								<span style="padding-right: 0.4rem">
									{outboundAirline}
								</span>
							</div>
							<Icon class="material-icons">airlines</Icon>
						</div>
						<div class="row">
							<span style="">
								{outboundArrivalDatetime.toLocaleTimeString('de-DE', optionsTime)}
							</span>
							<span style="padding-left: 1rem;">
								{outboundArrivalAirport}
							</span>
						</div>
					</div>
					<div class="inbound" style="margin-top: 2rem;">
						<div class="row">
							<Icon class="material-icons">flight_land</Icon>
							<span style="font-weight: 700; padding-left: 0.3rem;">
								{returnDate.toLocaleDateString('de-DE', optionsDate)}
							</span>
						</div>
						<div class="row">
							<span style="">
								{returnDate.toLocaleTimeString('de-DE', optionsTime)}
							</span>
							<span style="padding-left: 1rem;">
								{inboundDepartureAirport}
							</span>
						</div>
						<div class="row">
							<div style="padding-left: 0.57rem;" />
							<Icon class="material-icons">south</Icon>
							<div style="color: #ccc">
								<span style="padding-left: 1.6rem;">
									{new Date(inboundArrivalDatetime.getTime() - returnDate.getTime()).toLocaleTimeString('de-DE', optionsTime)}
								</span>
								&nbsp; | &nbsp;
								<span style="padding-right: 0.4rem">
									{inboundAirline}
								</span>
							</div>
							<Icon class="material-icons">airlines</Icon>
						</div>
						<div class="row">
							<span style="">
								{inboundArrivalDatetime.toLocaleTimeString('de-DE', optionsTime)}
							</span>
							<span style="padding-left: 1rem;">
								{inboundArrivalAirport}
							</span>
						</div>
					</div>
				</div>
				<div class="column comfort">
					<div class="row" style="margin-bottom: 0.5rem;">
						<Icon class="material-icons">person</Icon>
						<span style="padding-left: 1rem;">
							{adults} Erwachsene{adults > 1 ? '' : 'r'}{#if children > 0}, {children} Kind{children > 2 ? 'er' : ''} {/if}
						</span>
					</div>
					<div class="row" style="margin-bottom: 0.5rem;">
						<Icon class="material-icons">hotel</Icon>
						<span style="padding-left: 1rem;"> {roomtype} </span>
					</div>
					<div class="row" style="margin-bottom: 0.5rem;">
						<Icon class="material-icons">restaurant</Icon>
						<span style="padding-left: 1rem;"> {mealtype} </span>
					</div>
					<div class="row" style="margin-bottom: 0.5rem;">
						<Icon class="material-icons">houseboat</Icon>
						<span style="padding-left: 1rem;"> {oceanview ? 'mit Blick aufs Meer' : 'Ohne Blick aufs Meer'} </span>
					</div>
				</div>
				<div class="column bill">
					{#each adultsPrices as adultPrice}
						<div class="row spaceBetween">
							<span>Adult</span>
							<span>{adultPrice} €</span>
						</div>
					{/each}
					{#if children > 0}
						{#each childrenPrices as childPrice}
							<div class="row spaceBetween">
								<span>Child</span>
								<span>{childPrice} €</span>
							</div>
						{/each}
					{/if}
					<div class="billTotal row spaceBetween" style="border-top: 2px #222 dotted; padding-top: 1rem;">
						<span>Total Price</span>
						<span style="font-weight: 700;">{price} €</span>
					</div>
					<div style="margin: auto;" />
					<Button variant="raised">
						<Label>Book</Label>
					</Button>
				</div>
			</div>
		</Content>
	</Paper>
</div>

<style>
	.outer {
		padding-top: 1rem;
		padding-bottom: 1rem;
		padding-left: 2rem;
		padding-right: 2rem;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
	.row {
		display: flex;
		flex-direction: row;
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.spaceBetween {
		justify-content: space-between;
	}
</style>
