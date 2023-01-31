import formatting from './formatting.js'
import timeEntries from './time-entries.js'

const stop = async (entry) => {
    const stopped = await timeEntries.stop(entry)
    console.log(formatting.timeEntry.stopped(stopped))
}

export default {
    run: async ({ entry }) => {
        if (entry?.['is_running'] === false) {
            console.error('expected running entry; got', entry)
            return
        }

        await stop(entry)
    }
}