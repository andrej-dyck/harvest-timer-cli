const done = {}

export default {
    initSync: (key, action) => {
        if (!!done[key]) return

        action()
        done.key = true
    }
}