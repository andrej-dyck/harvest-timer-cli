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
    return now.add(Number(n), 'minutes').format('HH:mm')
}

const inputTime = ({ message, defaultTime = undefined }) =>
    prompt.input({
        message,
        defaultInput: defaultTime ?? 'now',
        validate: (input) =>
            input === 'now' || matchesHoursMinutes(input) || matchesRelativeTime(input)
                ? true
                : 'must be either \'now\',\n' +
                'a time of day of form \'HH:mm\' (colon optional) e.g., 12:45 or 1245,\n' +
                'or relative time of form \'(-+)(1-99)m\' (only minutes supported); e.g. -15m'
    }).then(
        (time) => time === 'now' ? undefined
            : /^[+\-]/.test(time) ? convertToTime(dayjs(), time)
                : ensureColon(time).padStart(5, '0')
    )

export default {
    started: ({ defaultTime = undefined } = {}) =>
        inputTime({ message: 'Start time', defaultTime })
}