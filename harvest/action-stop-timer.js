import timeEntries from './time-entries.js'

const run = async ({ entry }) => {
    const stopped = await timeEntries.stop(entry)
    console.log(timeEntries.format.stopped(stopped))
}

export default { run }