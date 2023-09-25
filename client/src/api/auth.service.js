import axios from 'axios';

import config from '../config/dev.json';
let path = '/api/v1'
let AUTH_URL = config.host + path + "/auth";
let user_url = config.host + path + "/user";
if (process.env.NODE_ENV === 'production') {
    url = config.host + path
    urlSecure = config.host + path + '/secure'
}

export async function Login(user) {
    return new Promise((resolve, reject) => {
        axios
            .post(AUTH_URL + "/login", {
                email: user.email,
                password: user.password,
            })
            .then((res) => {
                if (res) {
                    localStorage.setItem("token", res.data.token);
                    //console.log("CHECK THIS FOR ROLE OBJECT ", res.data.user)
                    resolve(res.data.user)
                }

            }).catch(error => {
                localStorage.removeItem('token')
                reject(error)
            })
    })
}
export async function getInfoByToken(token) {
    return new Promise((resolve, reject) => {
        tokenHeader(token)
        axios
            .get(AUTH_URL + "/getInfoByToken")
            .then((res) => {
                localStorage.setItem("token", token);
                resolve(res.data[0])
            }).catch(error => {
                reject(error)
            })
    })
}
export async function updateProfileUser(user) {
    return new Promise((resolve, reject) => {
        tokenHeader(localStorage.token)
        axios
            .post(AUTH_URL + "/updateProfile", user)
            .then((res) => {
                //console.log("####", res.data[0])
                resolve(res.data[0])
            }).catch(error => {
                console.log("####", error)
                reject(error)
            })
    })
}
export async function updatePassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        console.log("newPassword newPassword in service tho: ", newPassword)
        tokenHeader(localStorage.token)
        axios
            .post(AUTH_URL + "/updatePassword", {
                currentPassword,
                newPassword
            })
            .then((res) => {
                console.log("data updatePassword/auth service", res.data.data)
                resolve(res.data.data)
            }).catch(error => {
                console.log("data updatePassword/auth service error.response.data", error.response.data)
                reject(error.response.data)
            })


    })
}
// still have problem in this
export async function checkPassword(passwordEntered) {
    return new Promise((resolve, reject) => {
        tokenHeader(localStorage.token)
        axios
            .get(AUTH_URL + "/verifyPassword" + "/" +
                passwordEntered)
            .then((res) => {
                if (res) {
                    resolve(res.data.data)
                    console.log("res", res.data.data);
                    //this.dialog = false;
                    //this.v = true;
                }
            }).catch(errors => {
                reject(errors)
                console.log('error', errors)
            });
    })
}
export async function forgotPassword(userEmail) {
    return new Promise((resolve, reject) => {
        axios
            .put(AUTH_URL + "/forgotPassword", {
                email: userEmail
            })
            .then((res) => {
                if (res) {
                    resolve(res.data.data)
                }
            }).catch(error => {
                if (error) {
                    reject(error.response.data.errors)
                }

            });
    })
}
export async function resetPassword(userEmail) {
    return new Promise((resolve, reject) => {
        tokenHeader(localStorage.token)
        axios
            .put(AUTH_URL + "/resetPassword", {
                email: userEmail
            })
            .then((res) => {
                if (res) {
                    resolve(res.data.data)
                }
            }).catch(error => {
                if (error) {
                    console.log("##error", error.response)
                    console.log("@@error", error)
                    reject(error.response.data.errors)
                }

            });
    })
}
// export async function resetPassword(userEmail) {
//     return new Promise((resolve, reject) => {
//         axios.defaults.headers["Authorization"] =
//             "Bearer " + this.$route.params.token;
//         axios
//             .put(AUTH_URL, {
//                 newPassword: this.password,
//                 confirmPassword: this.confirmPassword,
//             })
//             .then((res) => {
//                 this.icon = "mdi-check-circle-outline";
//                 this.snackbarText = res.data.data;
//                 this.color = "success";
//                 this.snackbar = true;
//                 //this.$router.push("/Login");
//             })
//             .catch((error) => {
//                 // this.$router.push("/forgetPassword");
//                 //console.log("error while forgot password api", err);
//                 this.icon = "mdi-alert";
//                 this.snackbarText = error.response.data.errors;
//                 this.color = "red";
//                 this.snackbar = true;
//             });
//     })
// }
export async function tokenHeader(token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token
}