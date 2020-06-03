import axios from 'axios';

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
	error => {
		if (error.response.status) {
			switch (error.response.status) {
				case 400:
				break;
			
				case 401:
				break;
			}

			return Promise.reject(error);
		}
	}
);


export default repo;
