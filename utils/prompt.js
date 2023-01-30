import inquirer from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import fuzzy from 'fuzzy'

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export default {
    question: {
        input: ({ name, message }) => ({ type: 'input', name, message }),
        select: ({ name, message, choices }) => ({
            type: 'autocomplete', name, message,
            suggestOnly: false,
            source: (_, input) => {
                if (!input) return choices

                const results = fuzzy.filter(input, choices)
                return results.map((m) => m.original)
            },
        })
    },
    with: async (questions) => await inquirer.prompt(questions)
}