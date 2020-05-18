import repository from '../repository';

const state = {
    token
};

const getters = {
    token: state = state.token
};

const actions = {
	async login({ commit }, {email, password}) {

		const response = await repository.get(
            `/player/login`,
            {
                email: email,
                password: password
            }
        );

		console.log(response.data);

		commit('setToken', response.data);
	}
};

const mutations = {
	setToken: (state, token) => (state.token = token),
};

export default {
	state,
	getters,
	actions,
	mutations
};