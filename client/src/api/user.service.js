import axios from 'axios';
import config from '../config/dev.json';
let path = '/api/v1'
let user_url = config.host + path + "/user";
if (process.env.NODE_ENV === 'production') {
    url = config.host + path
    urlSecure = config.host + path + '/secure'
}

export async function updateProfileUser(user) {
    return new Promise((resolve, reject) => {
        tokenHeader(localStorage.token)
        axios
            .post(user_url + "/updateProfileUser", user)
            .then((res) => {
                console.log("########", res)
                resolve(res.data.data)
            }).catch(error => {
                console.log("########", error)
                reject(error)
            })
    })
}
export async function tokenHeader(token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token
}