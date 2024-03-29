<template>
	<div class="container">
		<div class="scorecard-header">
			<div class="name-and-weather">			
				{{ scorecard.course.name }} <span v-if="scorecard.weather" class="weather-icon-spacer">|</span>
				<b-icon v-if="scorecard.weather" class="weather-icon" :icon="scorecard.weather" />
			</div>
			<div>{{ scorecard.datetime | moment("DD-MM-YYYY") }}</div>
		</div>
		<b-table
			:data="rounds" 
			:default-sort="'sum'"
			:mobile-cards="false"
			:scrollable="false">
			<template>
				<b-table-column v-slot="props" cell-class="pos-col" width="6%" field="pos" label="Pos." centered @click="test(props)">
					{{ rounds.indexOf(props.row) + 1 }}
				</b-table-column>

				<b-table-column v-if="!isMobile()" v-slot="props" width="30%" field="firstName" label="Fornavn">
					{{ props.row.firstName }}
				</b-table-column>

				<b-table-column v-slot="props" :width="isMobile() ? '60%' : '30%'" field="lastName" label="Etternavn">
					{{ props.row.lastName }} 
					<span v-if="props.row.adjustedSum() <= 0" style="margin-left: 10px"> &#x1F525; </span>
					<img v-if="props.row.adjustedSum() >= 20" src="@/assets/images/richard_emoji.png" alt="Richard Emoji" width="13" style="vertical-align: bottom; margin-left: 10px;">
				</b-table-column>

				<b-table-column v-slot="props" width="10%" field="numberOfThrows" label="Kast" centered>
					{{ props.row.numberOfThrows }}
				</b-table-column>

				<b-table-column v-if="scorecard.course.name !== 'Enga Frisbeegolfbane'" v-slot="props" width="12%" field="sum" label="SUM" centered>
					<span class="tag" :style="getRoundSumColour(props.row.sum)">
						{{ props.row.sum > 0 ? `+${props.row.sum}` : props.row.sum }}
					</span>
				</b-table-column>
				<b-table-column v-if="scorecard.course.name === 'Enga Frisbeegolfbane'" v-slot="props" width="12%" field="sum" label="SUM" centered>
					{{ props.row.sum > 0 ? `+${props.row.sum}` : props.row.sum }}
				</b-table-column>
				<b-table-column v-if="scorecard.course.name === 'Enga Frisbeegolfbane'" v-slot="props" width="12%" field="sum" label="HCS" centered>
					<span v-if="props.row.adjustedSum" class="tag" :style="getRoundSumColour(props.row.adjustedSum())">
						{{ props.row.adjustedSum() > 0 ? `+${props.row.adjustedSum()}` : props.row.adjustedSum() }}
					</span>
				</b-table-column>
			</template>
		</b-table>
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
			defaultSort: 'numberOfThrows'
		};
	},
	computed: {
		rounds: function() {
			let rounds = [];
			for (const round of this.scorecard.rounds) {
				let newRound = {
					firstName: round.player.firstName,
					lastName: round.player.lastName,
					numberOfThrows: round.numberOfThrows,
					sum: (round.numberOfThrows - this.scorecard.course.par),
					adjustedSum: () => {
						let sum = round.numberOfThrows - this.scorecard.course.par;

						if (round.handicapRating) {
							sum -= Math.round(round.handicapRating);
						}

						return sum;
					}
				};

				rounds.push(newRound);
			}

			rounds.sort((a, b) => a.adjustedSum() - b.adjustedSum());

			return rounds;
		}
	},

	methods: {
		isMobile() {
			return screen.width <= 600;
		},

		getRoundSumColour(roundSum) {
			if (roundSum === null) {
				return 'color: #9A9A9A';
			}

			const superScore = 0;
			const goodScoore = 4;
			const okScore = 9;

			if (roundSum < superScore) {
				return 'background-color: #3BB2E2; color: white;';
			} else if (roundSum <= goodScoore) {
				return 'background-color: #48c774; color: white;';
			} else if (roundSum <= okScore) {
				return 'background-color: #ffdd57; color: black;';
			} else {
				return 'background-color: #f14668; color: white;';
			}
		},

		getShortName(name) {
			const courseNameParts = name.split(' ');
			const firstPart = courseNameParts[0];

			return firstPart;
		}
	}
};
</script>

<style lang="scss" scoped>
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
		align-items: center;
		padding: 1px 10px;
		background-color: #F9F9F9;
	}

	.name-and-weather {
		display: flex;
		align-items: center;
	}
	
	.weather-icon-spacer {
		width: 1px;
		margin: 0px 7px;
		color: #A9A9A9;
	}

	::v-deep .pos-col {
		font-weight: 500;
	}

	.b-table {
		width: 100%;
	}

	.tag {
		width: 35px;
	}
</style>