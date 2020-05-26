import repository from '../repository';
import router from '../../router';


const state = {
	scorecards: []
};

const getters = {
	scorecards: state => state.scorecards
};


const endpoint = 'scorecard';
const actions = {
	async getScorecards({ commit }, {course, year}) {
		const response = await repository.get(`/${endpoint}?course=${course}&year=${year}`);
		commit('setScorecards', response.data);
	},

	async postScorecard({commit}, {course, datetime, rounds}) {
		await repository.post(`/${endpoint}`, 
			{
				course,
				datetime,
				rounds
			}, 
			{
				withCredentials: true
			}
		).then((response) => {
			commit('addScorecard', response.data);
			router.push('/');

		}).catch((error) => {

		});

	}
//   async addTodo({ commit }, title) {
//     const response = await axios.post(
//       'https://jsonplaceholder.typicode.com/todos',
//       { title, completed: false }
//     );

//     commit('newTodo', response.data);
//   },
//   async deleteTodo({ commit }, id) {
//     await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);

//     commit('removeTodo', id);
//   },
//   async filterTodos({ commit }, e) {
//     // Get selected number
//     const limit = parseInt(
//       e.target.options[e.target.options.selectedIndex].innerText
//     );

//     const response = await axios.get(
//       `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`
//     );

//     commit('setTodos', response.data);
//   },
//   async updateTodo({ commit }, updTodo) {
//     const response = await axios.put(
//       `https://jsonplaceholder.typicode.com/todos/${updTodo.id}`,
//       updTodo
//     );

//     console.log(response.data);

//     commit('updateTodo', response.data);
//   }
};

const mutations = {
	setScorecards: (state, scorecards) => (state.scorecards = scorecards),
	addScorecard: (state, scorecard) => (state.scorecards.unshift(scorecard))
//   newTodo: (state, todo) => state.todos.unshift(todo),
//   removeTodo: (state, id) =>
//     (state.todos = state.todos.filter(todo => todo.id !== id)),
//   updateTodo: (state, updTodo) => {
//     const index = state.todos.findIndex(todo => todo.id === updTodo.id);
//     if (index !== -1) {
//       state.todos.splice(index, 1, updTodo);
//     }
//   }
};

export default {
	state,
	getters,
	actions,
	mutations
};