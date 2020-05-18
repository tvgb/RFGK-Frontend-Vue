<template>
	<div class="container">
		<div class="scorecard-header">
			<div>{{ scorecard.course.name }}</div>
			<div>{{ scorecard.course.holes }} Hull  |  Par {{ scorecard.course.par }}</div>
		</div>
		<b-table :data="rounds" 
			:default-sort="'sum'"
			:mobile-cards="false">
			<template slot-scope="props">
				<b-table-column v-if="!isMobile()" :style="{'background-color': getColor(props.row.sum)}" field="firstName" label="Fornavn">
					{{ props.row.firstName }}
				</b-table-column>

				<b-table-column :style="{'background-color': getColor(props.row.sum)}" field="lastName" label="Etternavn">
					{{ props.row.lastName }}
				</b-table-column>

				<b-table-column :style="{'background-color': getColor(props.row.sum)}" field="numberOfThrows" label="Kast" centered>
					{{ props.row.numberOfThrows }}
				</b-table-column>

				<b-table-column :style="{'background-color': getColor(props.row.sum)}" field="sum" label="SUM" centered>
					<span class="tag" :class="getColor(props.row.sum)">
						{{ props.row.sum > 0 ? `+${props.row.sum}` : props.row.sum }}
					</span>
				</b-table-column>
			</template>
		</b-table>
		<!-- <div class="scorecard-footer">
			<div>{{ scorecard.createdBy.firstName }} {{ scorecard.createdBy.lastName }}</div>
			<div>{{ scorecard.datetime | moment("dddd, MMMM Do YYYY")}}</div>
		</div> -->
	</div>
</template>
 
<script>
export default {

	name: 'Scorecard',
	props: [
		'scorecard'
	],
	data() {
		return {
			columns: [
				{
					field: 'firstName',
					label: 'Fornavn',
				},
				{
					field: 'lastName',
					label: 'Etternavn',
				},
				{
					field: 'numberOfThrows',
					label: 'antall_kast',
					centered: true
				},
				{
					field: 'sum',
					label: 'sum',
					centered: true
				}
			],
			
			defaultSort: 'numberOfThrows'
		}
	},
	computed: {
		rounds: function() {

			let rounds = [];
			for (const round of this.scorecard.rounds) {
				let newRound = {
					firstName: round.player.firstName,
					lastName: round.player.lastName,
					numberOfThrows: round.numberOfThrows,
					sum: (round.numberOfThrows - this.scorecard.course.par)
				}

				rounds.push(newRound);
			}

			rounds.sort((a, b) => a.sum - b.sum);

			return rounds;
		}
	},

	methods: {
		isMobile() {
			return screen.width <= 600;
		},

		getColor(score) {
			const goodScoore = 5;
			const okScore = 10;
			// const redMax = 30;
			// const greenMax = 0;
			// const alpha = 0.85;

			// if (score <= goodScoore) {
			// 	// lightness green range 90 - 70
			// 	const step = 20 / Math.abs(greenMax - goodScoore);
			// 	let lightness = 70 + score * step;
			// 	if (lightness < 70) {lightness = 70; } else if (lightness > 90) {lightness = 90; }

			// 	return `hsla(120, 70%, ${lightness}%, ${alpha})`;

			// } else if (score <= okScore) {
			// 	//
			// 	const step = 20 / (okScore - goodScoore);
			// 	let lightness = 90 - score + step;
			// 	if (lightness < 70) {lightness = 70; } else if (lightness > 90) {lightness = 90; }

			// 	return `hsla(60, 100%, ${lightness}%, ${alpha})`;

			// } else {
			// 	// lightness red range 90 - 70
			// 	const step = 20 / (redMax - goodScoore);
			// 	let lightness = 90 - score * step;
			// 	if (lightness < 70) {lightness = 70; } else if (lightness > 90) {lightness = 90; }

			// 	return `hsla(0, 100%, ${lightness}%, ${alpha})`;
			// }

			// if (score <= goodScoore) {
			// 	return '#d5f5d5';
			// } else if (score <= okScore) {
			// 	return '#fefec8';
			// } else {
			// 	return '#fec8c8';
			// }

			if (score <= goodScoore) {
				return 'is-success';
			} else if (score <= okScore) {
				return 'is-warning';
			} else {
				return 'is-danger';
			}
		}
	}
}
</script>

<style scoped>
	.container {
		background-color: white;
		margin: 10px;
		width: 90%;
	}

	@media only screen and (max-width: 600px) {
		.container {
			font-size: 0.8em;
		}
	}

	.scorecard-header, .scorecard-footer {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 1px 10px;
		background-color: #F9F9F9;
	}
	

	.b-table {
		width: 100%;
	}

	.tag {
		width: 35px;
	}

</style>