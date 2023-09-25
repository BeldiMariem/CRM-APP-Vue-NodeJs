import {
    updateProfileUser
} from '@/api/user.service.js'

export default {
    state: {
        updatedUser: {}
    },
    getters: {
        getUpdatedUser(state) {
            return state.updatedUser
        }
    },
    mutations: {
        setUpdatedUser(state, output) {
            state.updatedUser = output
        }
    },
    actions: {
        async updateProfileUser(context, userInfo) {
            let updatedProfileUser = await updateProfileUser(userInfo);
            context.commit('setUpdatedUser', updatedProfileUser)
            return updatedProfileUser
        }
    }
}