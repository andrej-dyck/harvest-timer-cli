import dayjs from 'dayjs'
import prompt from '../utils/prompt.js'

const matchesHoursMinutes = (timeInput) =>
    /^([0-1]?[0-9]|2[0-3]):?[0-5][0-9]$/.test(timeInput.trim())

const ensureColon = (timeInput) => {
    const insertColon = (t) => t.replace(/(\d?\d)(\d{2})/, '$1:$2')
    return timeInput.includes(':') ? timeInput : insertColon(timeInput)
}

const matchesRelativeTime = (timeInput) =>
    /^[+\-][1-9][0-9]?\s?m(in)?$/.test(timeInput.trim())

const convertToTime = (now, relativeTimeInput) => {
    const n = relativeTimeInput.match(/^[+\-]\d+/)
    if (n === null) throw Error('expected relative time')

    // only supporting minutes right now
    return now.add(Number(n), 'minutes')
}

const inputTime = ({ message, defaultTime, now }) =>
    prompt.input({
        message,
        defaultInput: defaultTime ?? 'now',
        validate: (input) =>
            input === 'now' || matchesHoursMinutes(input) || matchesRelativeTime(input)
                ? true
                : invalidTimeInputMessage
    }).then(
        (time) => {
            if (time === 'now') return now()
            if (/^[+\-]/.test(time)) return convertToTime(dayjs(), time)
            else return ensureColon(time).padStart(5, '0')
        }
    ).then(
        (time) => dayjs.isDayjs(time) ? time.format('HH:mm') : time
    )

const invalidTimeInputMessage = 'must be either ' +
    '\'now\',\n' +
    'a time of day of form \'HH:mm\' or \'HHmm\'; e.g., 12:45 or 1245,\n' +
    'or relative time of form \'(-+)(1-99)m\' (in minutes); e.g. -15m'

export default {
    started: ({ defaultTime = 'now', now = () => dayjs() } = {}) =>
        inputTime({ message: 'Start time', defaultTime, now }),
    ended: ({ defaultTime = 'now', now = () => dayjs() } = {}) =>
        inputTime({ message: 'Ended time', defaultTime, now })
}