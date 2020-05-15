import axios from 'axios';

// You can use your own logic to set your local or production domain
const baseDomain = process.env.VUE_APP_API_URL;
console.log(baseDomain);
// The base URL is empty this time due we are using the jsonplaceholder API
const baseURL = `${baseDomain}/api`;

export default axios.create({
  baseURL
  // Headers: {"Authorization": "Bearer <yourToken>"}
});
