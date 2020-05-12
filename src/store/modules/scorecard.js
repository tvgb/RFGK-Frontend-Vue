import axios from 'axios';
import reposirort from '../repository';

const state = {
  scorecards: []
};

const getters = {
  scorecards: state => state.scorecards
};

const actions = {
  async getScorecards({ commit }) {
    const response = await axios.get(
      'http://localhost:3000/api/scorecard'
    );

    console.log(response.data);

    commit('setScorecards', response.data);
  },
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