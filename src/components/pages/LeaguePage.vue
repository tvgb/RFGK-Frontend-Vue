<template>
	<div class="container">
		<div class="info-text">
			Oppsett:
			<ul>
				<li> De 5 beste rundene fra Parken Frisbeegolfbane teller. </li>
				<li> Serien varer fra 1. mai til 1. september 2021. </li>
				<li> En runde må minst ha 3 spillere med for å telle. </li>
				<li> Man får tildelt poeng avhening av scoren i en runde (e = 180 poeng). </li>
				<li> Det blir gitt 20 bonuspoeng til vinneren av en runde. </li>
			</ul>
		</div>
		<b-table v-if="!isLoading && players.length > 0" :data="players" :mobile-cards="false" :scrollable="false">
			<template>
				<b-table-column v-slot="props" class="t-col" field="posistion" label="Pos" centered>
					{{ getPlayerIndex(props.row.player) + 1 }} 
				</b-table-column>
				<b-table-column v-slot="props" field="firstName" label="Fornavn">
					{{ getFirstFirstName(props.row.player.firstName) }} 
				</b-table-column>
				<b-table-column v-if="!isMobile" v-slot="props" field="lastName" label="Etternavn">
					{{ props.row.player.lastName }} 
				</b-table-column>

				<b-table-column v-slot="props" field="points" label="Poeng">
					<div class="points-container">
						<span 
							v-for="(score, index) in props.row.scores"
							:key="`score-${index}-${props.row.player._id}`" 
							class="point"
							:style="getColour(score, 200)">
							{{ score > 0 ? score : '-' }} 
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
			isMobile: window.innerWidth < 600
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
		}
	}
};
</script>

<style lang="scss" scoped>
	.container {
		width: 700px;
	}

	.points-container {
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
		padding: 0px 10px 20px 10px;
		font-weight: 500;

		ul {
			list-style-type: circle;
			font-weight: 400;
			font-size: 0.9rem;
			padding-left: 15px;
			color: $main-grey-900;
		}
	}

	@media only screen and (max-width: 800px) {
		.container {
			width: 100%;
			padding: 0px 5px;
		}

		.b-table {
			font-size: 0.9rem;
		}

		.t-col {
			display: none;
		}
	}

</style>