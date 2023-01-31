const done = {}

export default {
    init: async (key, action ) => {
        if (!!done[key]) return

        await action()
        done.key = true
    },
    initSync: (key, action) => {
        if (!!done[key]) return

        action()
        done.key = true
    }
}