import repository from '../repository';

const state = {
	courses: []
};

const getters = {
	activeCourses: state => {
		let courses = state.courses.filter(course => !course.isInactive);

		const mostUsed = JSON.parse(localStorage.getItem('mostUsed'));

		if (mostUsed) {
			courses = courses.map((course) => {
				const usedCourse = mostUsed.courses.find(c => c._id === course._id);
				const uses = usedCourse ? usedCourse.uses : 0;
				Object.assign(course, {uses: uses});

				return course;
			});

			courses = courses.sort((a, b) => {
				if (a.uses > b.uses) {
					return -1;
				} else if (a.uses < b.uses) {
					return 1;
				} else {
					return 0;
				}
			});
		}

		return courses;
	},
	allCourses: state => state.courses.map((course) => {
		if (course.isInactive) {
			course.name = `${course.name} (inaktiv)`; 
		}

		return course;
	})
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