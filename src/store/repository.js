import axios from 'axios';
import store from '.';

// You can use your own logic to set your local or production domain
const baseDomain = process.env.VUE_APP_API_URL;
// The base URL is empty this time due we are using the jsonplaceholder API
const baseURL = `${baseDomain}/api`;

let repo = axios.create({
	baseURL
});

repo.interceptors.response.use(
	response => {
		if (response.status === 200 || response.status === 201) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},
	async error => {
		if (error.response.status) {
			switch (error.response.status) {
				case 400:
					return Promise.reject(error);
			
				case 401:
					return repo.post('/player/refreshToken', {}, {withCredentials: true}).then(async () => {
						return repo.request(error.config).then((res) => {
							return Promise.resolve(res);
						}).catch((error) => {
							Promise.reject(error);
						});
					}).catch((error) => {
						Promise.reject(error);
					});

				case 403:
					store.dispatch('logout');
					return Promise.reject(error);

				default:
					return Promise.reject(error);
			}
		}
	}
);


export default repo;
