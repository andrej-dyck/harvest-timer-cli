import calendar from '../utils/calendar.js'
import prompt from '../utils/prompt.js'
import workdays from '../utils/workdays.js'

const chooseDay = async ({ today = calendar.today(), current = today } = {}) => {
    const days = [0, 1, 2, 3, 4, 5, 6, 7]
        .map((d) => today.subtract(d, 'day'))
        .filter((d) => workdays.isWorkday(d) && !d.isSame(current, 'day'))

    return prompt.selection({
        message: 'Which day?',
        choices: prompt.choices.named(days, (d) => d.format('ddd, DD.MM.YYYY'))
    })
}

export default chooseDay