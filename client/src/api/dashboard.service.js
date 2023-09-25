import axios from 'axios';

import config from '../config/dev.json';
let path = '/api/v1'
//let AUTH_URL = config.host + path + "/auth";
//let user_url = config.host + path + "/user";
let activity_url = config.host + path + "activity";
if (process.env.NODE_ENV === 'production') {
    url = config.host + path
    urlSecure = config.host + path + '/secure'
}


export async function GetActivities(currentUserId) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "http://localhost:3000/api/v1/activity/getActivities/" +
                currentUserId
            )
            .then((results) => {
                resolve(results.data.data)
            });
    })
}


export async function tokenHeader(token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token
}