import api from './api.js'
import formatting from './formatting.js'
import inputTime from './input-time.js'

export default {
    run: async ({ entry }) => {
        if (entry?.['is_running'] === false) {
            console.error('expected running entry; got', entry)
            return
        }

        const ended_time = await inputTime.ended({ now: () => undefined })

        const stopped = !ended_time
            ? await api.time.stop(entry)
            : await api.time.editEntry(entry, { ended_time })
        return { output: formatting.timeEntry.stopped(stopped) }
    }
}