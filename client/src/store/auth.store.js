import {
    Login,
    updateProfileUser
} from '@/api/auth.service.js'

export default {
    state: {
        currentUser: {},

    },
    getters: {
        getCurrentUser(state) {
            return state.currentUser
        }
    },
    mutations: {
        setCurrentUser(state, output) {
            state.currentUser = output
        }
    },
    actions: {
        async loginAction(context, user) {
            let loggedInUser = await Login(user);
            context.commit('setCurrentUser', loggedInUser[0])
            return loggedInUser[0]
        },
        async updateProfileUserAction(context, userInfo) {
            let updatedProfileUser = await updateProfileUser(userInfo);
            context.commit('setCurrentUser', updatedProfileUser)
            return updatedProfileUser
        },
        async logout() {
            return localStorage.clear();
        }

    }
}