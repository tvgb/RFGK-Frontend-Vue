import repository from '../repository';

const state = {
	courses: []
};

const getters = {
	courses: state => state.courses.filter(course => !course.isInactive)
};

const actions = {
	async getCourses({ commit }) {
		const response = await repository.get('/course');
		commit('setCourses', response.data);
	}
};

const mutations = {
	setCourses: (state, courses) => (state.courses = courses),
};

export default {
	state,
	getters,
	actions,
	mutations
};