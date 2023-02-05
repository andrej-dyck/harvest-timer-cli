import fuzzy from 'fuzzy'
import inquirer from 'inquirer'
import autocompletePrompt from 'inquirer-autocomplete-prompt'
import lazy from './lazy.js'

// this lazy value should prevent registering event listeners again and again
const inquirerPrompt = lazy(async () => {
    inquirer.registerPrompt('autocomplete', autocompletePrompt)
    return inquirer.prompt
})

const prompt = async (questions) => (await inquirerPrompt.value())(questions)

const fuzzySearch = (choices) => (_, input = '') =>
    fuzzy.filter(input, choices, {
        extract: (el) => typeof el === 'string' ? el : el.name
    }).map((el) => el.original)

export const namedChoices = (choices, nameOf) =>
    choices.map((c) => ({ name: nameOf(c), value: c }))

export default {
    question: {
        input: ({ name, message }) =>
            ({ type: 'input', name, message }),
        select: ({ name, message, choices }) =>
            ({ type: 'autocomplete', name, message, source: fuzzySearch(choices), pageSize: 10, loop: false }),
        confirm: ({ name, message, defaultAnswer = true }) =>
            ({ type: 'confirm', name, message, default: defaultAnswer }),
    },
    choices: {
        cancel: { name: '❌ cancel', value: 'cancel' }
    },
    answers: {
        takeIfNotCanceled: (value) => value === 'cancel' ? undefined : value
    },
    ask: (questions) => prompt(questions)
}