<template>
    <div class="container">
        <div class="header">
            {{ this.course.name }}
        </div>
        <b-table 
            :data="rounds" 
            :default-sort="'sum'"
            :mobile-cards="false">

            <template slot-scope="props">
                <b-table-column field="firstName" label="Fornavn">
                    {{ props.row.firstName }}
                </b-table-column>

                <b-table-column field="lastName" label="Etternavn">
                    {{ props.row.lastName }}
                </b-table-column>

                <b-table-column field="numberOfThrows" label="Antall kast" centered>
                    {{ props.row.numberOfThrows }}
                </b-table-column>

                <b-table-column field="sum" label="SUM" centered sortable>
                {{ props.row.sum > 0 ? `+${props.row.sum}` : props.row.sum }}
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
                    sum: (round.numberOfThrows - round.course.par)
                }

                rounds.push(newRound);
            }

            return rounds;
        },
        course: function() {
            return this.scorecard.rounds[0].course;
        }
    }
}
</script>

<style scoped>
    .table {
        background-color: transparent;
    }
</style>