import axios from 'axios'

const token = localStorage.getItem('auth')
if (token) {
  axios.defaults.headers.common['Authorizations'] = token
}


export default axios.create({
  baseURL: 'http://localhost:3030/api/'
})