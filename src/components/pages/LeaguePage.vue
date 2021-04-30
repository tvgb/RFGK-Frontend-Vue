<template>
	<div class="container">
		<div v-if="!isLoading && players.length > 0" class="table-header">
			Tabell
			<span class="swith-wrapper">
				<span style="margin-right: 10px;"> Vis poeng: </span>
				<b-switch v-model="showPoints" type="pale-orange" />
			</span>
		</div>
		<div class="league-table-wrapper">
			<b-table v-if="!isLoading && players.length > 0" :data="players" :mobile-cards="false" :scrollable="false">
				<template>
					<b-table-column v-slot="props" cell-class="pos-cell" header-class="pos-header" field="posistion" label="Pos" centered>
						{{ getPlayerIndex(props.row.player) + 1 }} 
					</b-table-column>
					<b-table-column v-slot="props" field="firstName" label="Fornavn">
						{{ getFirstFirstName(props.row.player.firstName) }} 
					</b-table-column>
					<b-table-column v-if="!isMobile" v-slot="props" field="lastName" label="Etternavn">
						{{ props.row.player.lastName }} 
					</b-table-column>

					<b-table-column v-slot="props" field="points" label="Poeng">
						<div v-if="showPoints" class="points-container">
							<span 
								v-for="(score, index) in props.row.scores"
								:key="`score-${index}-${props.row.player._id}`" 
								class="point"
								:style="getColour(score, 300)">
								{{ score > 0 ? score : '-' }} 
							</span>
						</div>

						<div v-if="!showPoints" class="round-sums-container">
							<span 
								v-for="(roundSum, index) in props.row.roundSums"
								:key="`round-sum-${index}-${props.row.player._id}`" 
								class="point"
								:style="getRoundSumColour(roundSum)">
								{{ formatRoundSum(roundSum) }} 
							</span>
						</div>
					</b-table-column>

					<b-table-column v-slot="props" field="sum" label="SUM" centered>
						<span class="sum-col" :style="getColour(props.row.sum, 1000)">
							{{ props.row.sum }} 
						</span>
					</b-table-column>
				</template>
			</b-table>
		</div>
		
		<b-collapse
			v-if="!isLoading"
			v-model="isOpen"
			aria-id="contentIdForA11y2"
			class="panel"
			animation="slide">
			<template #trigger>
				<div
					class="panel-heading"
					role="button"
					aria-controls="contentIdForA11y2">
					Regler
					<b-icon class="info-icon" icon="info" />
				</div>
			</template>
			<div class="info-text">
				<ul>
					<li> De 5 beste rundene fra Parken Frisbeegolfbane teller. </li>
					<li> Serien varer fra 1. mai til 1. september 2021. </li>
					<li> En runde må minst ha 3 spillere med for å telle. </li>
					<li> Man får tildelt poeng avhening av scoren i en runde (e = 180 poeng). </li>
					<li> Det blir gitt 20 bonuspoeng til vinneren av en runde. </li>
					<li> Hvis det er flere vinnere deles poengene likt blant dem. </li>
				</ul>
			</div>
		</b-collapse>

		<b-loading :active.sync="isLoading" :is-full-page="true" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'LeaguePage',
	
	data() {
		return {
			course: null,
			isLoading: true,
			isMobile: window.innerWidth < 600,
			isOpen: false,
			showPoints: true
		};
	},

	computed: {
		...mapGetters({
			players: 'leagueTablePlayers'
		})
	},

	created() {
		this.getCourses().then((courses) => {
			const parken = courses.find(c => c.name === 'Parken Frisbeegolfbane');
			this.course = parken;
			this.getScorecards({ courseId: parken._id, year: 2021 }).then(() => {
				this.isLoading = false;
			});
		});
	},

	methods: {
		...mapActions([
			'getScorecards',
			'getCourses'
		]),

		getPlayerIndex(player) {
			for (let i = 0; i < this.players.length; i++) {
				if (this.players[i].player._id === player._id) {
					return i;
				}
			}
		},

		getFirstFirstName(firstName) {
			return firstName.split(' ')[0];
		},

		getColour(score, maxScore) {
			if (score === 0) {
				return 'color: #9A9A9A';
			}

			const h = (score / maxScore) * 180;
			const s = 80;
			const l = 60;
			return `color: hsl(${h}, ${s}%, ${l}%)`;
		},

		getRoundSumColour(roundSum) {
			if (roundSum === null) {
				return 'color: #9A9A9A';
			}

			// const h = Math.max(-5 * roundSum + 140, 0);
			// const s = 80;
			// const l = 60;
			// return `color: hsl(${h}, ${s}%, ${l}%)`;
			const goodScoore = 4;
			const okScore = 9;
			
			if (roundSum <= goodScoore) {
				return 'color: #48c774';
			} else if (roundSum <= okScore) {
				return 'color: #ffdd57';
			} else {
				return 'color: #f14668';
			}
		},

		formatRoundSum(roundSum) {
			if (roundSum < 0) {
				return roundSum;
			} else if (roundSum === 0) {
				return 'e';
			} else if (roundSum > 0) {
				return `+${roundSum}`;
			} else {
				return '-';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.container {
		width: 700px;
	}

	.table-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 5px;
		font-weight: 500;
	}

	.league-table-wrapper {
		padding-top: 5px;
	}

	.points-container, .round-sums-container {
		display: flex;
		justify-content: space-between;
	}

	.point {
		width: 30px;
		text-align: center;
		color: white;
		font-weight: 500;
	}

	.sum-col {
		font-weight: 500;
	}

	.info-text {
		background-color: transparent;
		padding: 0px 10px 20px 10px;
		font-weight: 500;

		ul {
			list-style-type: circle;
			font-weight: 400;
			font-size: 0.9rem;
			padding-left: 30px;
			color: $main-grey-900;
		}
	}

	.panel {
		margin-top: 20px;
	}

	.panel-heading {
		background-color: transparent;
		font-weight: 300;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.info-icon {
		border: 2px solid #363636;
		border-radius: 100%;
		font-size: 1rem;
	}

	.swith-wrapper {
		display: flex;
		align-items: center;
		font-weight: 300;
		color: $main-grey-500;
	}

	@media only screen and (max-width: 800px) {
		.container {
			width: 100%;
			padding: 0px 15px 30px 15px;
		}

		.b-table {
			font-size: 0.9rem;
		}
	}

</style>

<style lang="scss">
	.league-table-wrapper .pos-header {
		padding-left: 5px;
		padding-right: 0px;
	}

	.switch.is-rounded {
		margin: 0px;
	}
</style>