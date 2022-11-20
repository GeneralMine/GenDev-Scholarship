<script>
	import Button from '@smui/button';
	import Slider from '@smui/slider';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Select, { Option } from '@smui/select';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Textfield from '@smui/textfield';
	import Card, { Content, PrimaryAction, Media, MediaContent } from '@smui/card';

	export let hotelId;
	export let departureDate;
	export let returnDate;
	export let adults;
	export let children;
	export let price;
	export let inboundDepartureAirport;
	export let inboundArrivalAirport;
	export let inboundArrivalDatetime;
	export let inboundAirline;
	export let outboundDepartureAirport;
	export let outboundArrivalAirport;
	export let outboundArrivalDatetime;
	export let outboundAirline;
	export let mealtype;
	export let oceanview;
	export let roomtype;
	export let hotel;
</script>

<div class="card-container" style="width: 400px; margin: 2rem;">
	<Card>
		<div style="padding: 1rem;">
			<h2 class="mdc-typography--headline6" style="margin: 0;">{hotel.name}</h2>
			<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
				{#each Array(hotel.category_stars) as _}⭐{/each}
			</h3>
		</div>
		<PrimaryAction>
			<Media class="card-media-16x9" aspectRatio="16x9" style="background-image: url('./hotel.jpg');" />
			<Content class="mdc-typography--body2">
				<div style="display: flex; justify-content: space-between;">
					<div style="display: flex; justify-content: space-between;">
						<h3 class="mdc-typography--subtitle2" style="margin: 0.3rem;">{roomtype}</h3>
						<h3 class="mdc-typography--subtitle2" style="margin: 0.3rem;">{mealtype}</h3>
						<h3 class="mdc-typography--subtitle2" style="margin: 0.3rem;">{oceanview}</h3>
					</div>
					<div>
						<h3 class="mdc-typography--subtitle2" style="margin: 0;">{price} €</h3>
					</div>
				</div>
			</Content>
		</PrimaryAction>
	</Card>
</div>
