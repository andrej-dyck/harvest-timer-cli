import calendar from '../utils/calendar.js'
import prompt, { namedChoices } from '../utils/prompt.js'
import workdays from '../utils/workdays.js'

const chooseDay = async ({ today, current }) => {
    const days = [0, 1, 2, 3, 4, 5, 6, 7]
        .map((d) => today.subtract(d, 'day'))
        .filter((d) => workdays.isWorkday(d) && !d.isSame(current, 'day'))

    return prompt.ask(
        prompt.question.select({
            name: 'day',
            message: 'Which day?',
            choices: namedChoices(days, (d) => d.format('ddd, DD.MM.YYYY'))
        })
    )
}

export default {
    run: ({ current = undefined } = {}) => {
        const today = calendar.today()
        return chooseDay({ today, current: current ?? today })
    }
}