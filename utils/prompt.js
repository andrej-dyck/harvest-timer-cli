import fuzzy from 'fuzzy'
import inquirer from 'inquirer'
import autocompletePrompt from 'inquirer-autocomplete-prompt'
import lazy from './lazy.js'

// this lazy value should prevent registering event listeners again and again
const inquirerPrompt = lazy(async () => {
    inquirer.registerPrompt('autocomplete', autocompletePrompt)
    return inquirer.prompt
})

const prompt = async (question) =>
    (await inquirerPrompt.value())({ ...question, name: 'answer' }).then(({ answer }) => answer)

const fuzzySearch = (choices) => (_, input = '') =>
    fuzzy.filter(input, choices, {
        extract: (el) => typeof el === 'string' ? el : el.name
    }).map((el) => el.original)

const namedChoices = (choices, nameOf) =>
    choices.map((c) => ({ name: nameOf(c), value: c }))

export default {
    input: ({ message, defaultInput = undefined, validate = undefined }) =>
        prompt({ type: 'input', message, default: defaultInput, validate }).then((answer) => answer.trim()),
    selection: ({ message, choices }) =>
        prompt({ type: 'autocomplete', message, source: fuzzySearch(choices), pageSize: 10, loop: false }),
    confirmation: ({ message, defaultAnswer = true }) =>
        prompt({ type: 'confirm', message, default: defaultAnswer }),
    choices: {
        named: namedChoices,
        cancel: { name: '❌ cancel', value: 'cancel' },
        takeIfNotCanceled: (value) => value === 'cancel' ? undefined : value
    },
}