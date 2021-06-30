<template>
	<div class="container">
		<div class="scorecard-header">
			<div class="name-and-weather">			
				{{ scorecard.course.name }} <span v-if="scorecard.weather" class="weather-icon-spacer">|</span>
				<b-icon v-if="scorecard.weather" class="weather-icon" :icon="scorecard.weather" />
			</div>
			<div>{{ scorecard.datetime | moment("DD-MM-YYYY") }}</div>
		</div>
		<b-table :data="rounds" 
			:default-sort="'sum'"
			:mobile-cards="false"
			:scrollable="false">
			<template>
				<b-table-column v-slot="props" cell-class="pos-col" width="6%" field="pos" label="Pos." centered @click="test(props)">
					{{ rounds.indexOf(props.row) + 1 }}
				</b-table-column>

				<b-table-column v-if="!isMobile()" v-slot="props" width="35%" field="firstName" label="Fornavn">
					{{ props.row.firstName }}
				</b-table-column>

				<b-table-column v-slot="props" :width="isMobile() ? '70%' : '35%'" field="lastName" label="Etternavn">
					{{ props.row.lastName }} 
					<span v-if="props.row.sum <= 2" style="margin-left: 10px"> &#x1F525; </span>
					<img v-if="props.row.sum >= 20" src="@/assets/images/richard_emoji.png" alt="Richard Emoji" width="13" style="vertical-align: bottom; margin-left: 10px;">
				</b-table-column>

				<b-table-column v-slot="props" width="12%" field="numberOfThrows" label="Kast" centered>
					{{ props.row.numberOfThrows }}
				</b-table-column>

				<b-table-column v-slot="props" width="12%" field="sum" label="SUM" centered>
					<span class="tag" :class="getColour(props.row.sum)">
						{{ props.row.sum > 0 ? `+${props.row.sum}` : props.row.sum }}
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
					sum: (round.numberOfThrows - this.scorecard.course.par)
				};

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

		getColour(score) {
			const goodScoore = 4;
			const okScore = 9;

			if (score <= goodScoore) {
				return 'is-success';
			} else if (score <= okScore) {
				return 'is-warning';
			} else {
				return 'is-danger';
			}
		},

		getShortName(name) {
			const courseNameParts = name.split(' ');
			const firstPart = courseNameParts[0];

			return firstPart;
		}
	}
}
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