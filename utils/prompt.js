import inquirer from 'inquirer'
import searchListPrompt from 'inquirer-search-list'
import once from './once.js'

once.initSync('search-list-prompt', () => {
    inquirer.registerPrompt('search-list', searchListPrompt)
})

export const namedChoices = (choices, nameOf) =>
    choices.map((c) => ({ name: nameOf(c), value: c }))

export default {
    question: {
        input: ({ name, message }) => ({ type: 'input', name, message }),
        select: ({ name, message, choices }) => ({ type: 'search-list', name, message, choices, loop: false })
    },
    ask: async (questions) => await inquirer.prompt(questions, {})
}