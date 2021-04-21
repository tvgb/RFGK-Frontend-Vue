<template>
	<div class="container">
		<div class="info-box">
			
		</div>
		<b-table v-if="!isLoading" :data="players" :mobile-cards="false">
			<template>
				<b-table-column v-slot="props" :width="10" field="posistion" label="Pos" centered>
					{{ getPlayerIndex(props.row.player) + 1 }} 
				</b-table-column>
				<b-table-column v-slot="props" :width="20" field="lastName" label="Etternavn">
					{{ getFirstFirstName(props.row.player.firstName) }} 
				</b-table-column>

				<b-table-column v-slot="props" :width="50" field="points" label="Poeng">
					<div class="points-container">
						<span 
							v-for="(score, index) in props.row.scores"
							:key="`score-${index}-${props.row.player._id}`" 
							class="point"
							:style="getColour(score, 125)">
							{{ score > 0 ? score : '-' }} 
						</span>
					</div>
				</b-table-column>

				<b-table-column v-slot="props" :width="50" field="sum" label="SUM" centered>
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
			isLoading: true
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

<style scoped>
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

	.info-box {
		margin-bottom: 10px;
	}

	@media only screen and (max-width: 600px) {
		.container {
			width: 100%;
			padding: 0px 5px;
		}
	}

</style>