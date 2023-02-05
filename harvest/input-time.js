import prompt from '../utils/prompt.js'

const matchesHoursMinutes = (timeInput) =>
    /^([0-1]?[0-9]|2[0-3]):?[0-5][0-9]$/.test(timeInput.trim())

const ensureColon = (timeInput) => {
    const insertColon = (t) => t.replace(/(\d?\d)(\d\d)/, '$1:$2')
    return timeInput.includes(':') ? timeInput : insertColon(timeInput)
}

const inputTime = ({ message, defaultTime = undefined }) =>
    prompt.ask(
        prompt.question.input({
            name: 'time',
            message,
            defaultValue: defaultTime ?? 'now',
            validate: (input) => input === 'now' || matchesHoursMinutes(input)
        })
    ).then(
        ({ time }) => time === 'now' ? undefined : ensureColon(time)
    )

export default {
    started: ({ defaultTime = undefined } = {}) =>
        inputTime({ message: 'Start time', defaultTime })
}