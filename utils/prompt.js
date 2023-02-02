import inquirer from 'inquirer'
import searchListPrompt from 'inquirer-search-list'
import lazy from './lazy.js'

const inquirerPrompt = lazy(async () => {
    inquirer.registerPrompt('search-list', searchListPrompt)
    return inquirer.prompt
})

// this lazy value should prevent registering event listeners again and again
const prompt = async (questions) => (await inquirerPrompt.value())(questions)

export const namedChoices = (choices, nameOf) =>
    choices.map((c) => ({ name: nameOf(c), value: c }))

export default {
    question: {
        input: ({ name, message }) => ({ type: 'input', name, message }),
        select: ({ name, message, choices }) => ({ type: 'search-list', name, message, choices, loop: false })
    },
    choices: {
        cancel: { name: '❌ cancel', value: 'cancel' }
    },
    answers: {
        isCancel: (value) => value === 'cancel'
    },
    ask: (questions) => prompt(questions)
}