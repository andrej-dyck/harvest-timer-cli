import timeEntries from './time-entries.js'

const run = async (logger, entry) => {
    const stopped = await timeEntries.stop(entry)
    logger(timeEntries.format.stopped(stopped))
}

export default { run }