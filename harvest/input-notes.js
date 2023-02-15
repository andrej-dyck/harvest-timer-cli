import prompt from '../utils/prompt.js'

const inputNotes = ({ defaultNotes = undefined } = {}) =>
    prompt.input({
        message: 'Notes',
        defaultInput: defaultNotes
    }).then((n) => n.trim())

export default inputNotes