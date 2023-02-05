import api from './api.js'
import formatting from './formatting.js'

export default {
    run: async ({ entry }) => {
        if (entry?.['is_running'] === false) {
            console.error('expected running entry; got', entry)
            return
        }

        const stopped = await api.time.stop(entry)
        return { output: formatting.timeEntry.stopped(stopped) }
    }
}