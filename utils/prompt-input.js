import { createPrompt, isBackspaceKey, isEnterKey, useKeypress, usePrefix, useState, } from '@inquirer/core'
import { chalk } from 'zx'

export default createPrompt((config, done) => {
    const [status, setStatus] = useState('pending')
    const [defaultValue, setDefaultValue] = useState(config['default'])
    const [errorMsg, setError] = useState(undefined)
    const [value, setValue] = useState('')

    const isLoading = status === 'loading'
    const prefix = usePrefix(isLoading)

    useKeypress(async (key, rl) => {
        // Ignore keypress while our prompt is doing other processing.
        if (status !== 'pending') {
            return
        }

        if (isEnterKey(key)) {
            const answer = value || defaultValue || ''
            setStatus('loading')
            const isValid = typeof config.validate === 'function' ? await config.validate(answer) : true
            if (isValid === true) {
                setValue(answer.trim())
                setStatus('done')
                done(answer.trim())
            } else {
                // TODO: Can we keep the value after validation failure?
                // `rl.line = value` works but it looses the cursor position.
                setValue('')
                setError(isValid || 'You must provide a valid value')
                setStatus('pending')
            }
        } else if (isBackspaceKey(key) && !value) {
            setDefaultValue(undefined)
        } else if (!!defaultValue && (key.name === 'left' || key.name === 'home')) {
            setDefaultValue(undefined)
            rl.write(defaultValue)
            rl.write(null, key)
            setValue(rl.line)
        } else {
            setValue(rl.line)
            setError(undefined)
        }
    })

    const message = chalk.bold(config.message)
    let formattedValue = value
    if (typeof config['transformer'] === 'function') {
        formattedValue = config['transformer'](value, { isFinal: status === 'done' })
    }
    if (status === 'done') {
        formattedValue = chalk.cyan(formattedValue)
    }

    let defaultStr = ''
    if (defaultValue && status !== 'done' && !value) {
        defaultStr = chalk.dim(` (${defaultValue})`)
    }

    let error = ''
    if (errorMsg) {
        error = chalk.red(`> ${errorMsg}`)
    }

    return [`${prefix} ${message}${defaultStr} ${formattedValue}`, error]
})
