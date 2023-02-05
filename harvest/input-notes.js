import prompt from '../utils/prompt.js'

const inputNotes = ({ defaultNotes = undefined } = {}) =>
    prompt.ask(
        prompt.question.input({
            name: 'notes',
            message: 'Notes',
            defaultInput: defaultNotes
        })
    ).then(({ notes }) => notes.trim())

export default inputNotes