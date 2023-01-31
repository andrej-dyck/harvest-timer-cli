import dayjs from 'dayjs'
import { chalk } from 'zx'
import once from '../utils/once.js'

once.initSync('dayjs-duration', () => {
    dayjs.extend(require('dayjs/plugin/duration'))
})

const formatAs1Line = ({
    is_running,
    notes,
    started_time,
    ended_time,
    project,
    task
}) =>
    `${icon(is_running)} ${formatTime({ started_time, ended_time })}` +
    ` ${formatNotes(notes)} on ${formatProject({ project, task })}`

const icon = (isRunning) => isRunning === true ? '⏳' : '📑'

const formatNotes = (notes) =>
    notes.length > 0 ? chalk.green(`"${notes}"`) : chalk.red('""')

const formatTime = ({ started_time, ended_time }) => {
    const pad0 = (time) => time.length === 4 ? '0' + time : time
    return !!ended_time ? `${pad0(started_time)}-${pad0(ended_time)}` : `since ${pad0(started_time)}`
}

const formatDuration = ({ hours }) => dayjs.duration(hours, 'hours').format('HH:mm')

const formatProject = ({
    project: { name: project_name },
    task: { name: task_name }
}) =>
    `${project_name} (${task_name.split('(')[0].replace(/^\d+/, '').trim()})`

const formatStopped = ({ notes, started_time, ended_time, hours }) =>
    !!ended_time
        ? `${chalk.bold('stopped')} ${formatNotes(notes)}:` +
        ` ⌚ ${formatTime({ started_time, ended_time })} (${hours}h)`
        : chalk.red('🛑 failed to stop timer')

const formatRestarted = ({ notes, started_time, is_running }) =>
    is_running
        ? `${chalk.bold('started')} ${formatNotes(notes)} at ${started_time}`
        : chalk.red('🛑 failed to restart timer')

export default {
    timeEntry: {
        oneLiner: (entry) => formatAs1Line(entry),
        stopped: (entry) => formatStopped(entry),
        restarted: (entry) => formatRestarted(entry),
    },
    duration: ({ hours }) => formatDuration({ hours })
}