import api from './api.js'
import { chalk } from 'zx'

const format = ({
    is_running,
    spent_date,
    hours,
    notes,
    started_time,
    ended_time,
    project: { name: project_name, code },
    task: { name: task_name }
}) => {
    const project = `📃 ${project_name} [${code}]: ${task_name}`
    const time = `⌚ ${formatTime({ started_time, ended_time, hours })}`
    return `${icon(is_running)} ${chalk.bold(spent_date)} ${formatNotes(notes)}\n  ${project}\n  ${time}\n`
}

const icon = (isRunning) => isRunning === true ? '⏳' : '✅'

const formatNotes = (notes) => chalk.green(`"${notes}"`)

const formatTime = ({ started_time, ended_time, hours }) =>
    started_time + (!!ended_time ? ` - ${ended_time}` : ` (${hours}h)`)

const formatAs1Line = ({
    notes,
    started_time,
    ended_time,
    hours,
    project: { name: project_name }
}) =>
    `📃 ${formatNotes(notes)} (${formatTime({ started_time, ended_time, hours })}) on ${project_name}`

const formatStopped = ({ notes, started_time, ended_time, hours }) =>
    !!ended_time
        ? `${chalk.bold('stopped')} ${formatNotes(notes)}: ${formatTime({ started_time, ended_time, hours })}`
        : chalk.red('🛑 failed to stop timer')

const formatRestarted = ({ notes, started_time, is_running }) =>
    is_running
        ? `${chalk.bold('started')} ${formatNotes(notes)} at ${started_time}`
        : chalk.red('🛑 failed to restart timer')

export default {
    latest: (user_id) => api.time.latest(user_id),
    ofDay: ({ user_id, day }) => {
        const dayIsoString = day.format('YYYY-MM-DD')
        return api.time.entries(user_id, { from: dayIsoString, to: dayIsoString })
    },

    stop: (entry) => api.time.stop(entry),
    restart: (entry) => api.time.restart(entry),

    format: {
        summary: (entry) => format(entry),
        short: (entry) => formatAs1Line(entry),
        stopped: (entry) => formatStopped(entry),
        restarted: (entry) => formatRestarted(entry)
    }
}