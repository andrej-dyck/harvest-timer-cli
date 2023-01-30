import { $, fs, path } from 'zx'
import lazy from './lazy.js'

const env = lazy(
    async () => {
        const dotenvFile = path.join(__dirname, '.env')
        return await fs.readFile(dotenvFile, 'utf8').then(
            (c) => c.split(/\r\n?/)
        ).then(
            (lines) => lines
                .map(l => l.split('='))
                .map(([k, v]) => ({ key: k.trim(), value: v.trim() }))
        ).then(
            (vars) => vars.forEach(({ key, value }) => $.env[key] = value)
        ).then(
            () => $.env
        )
    }
)

export default {
    read: () => env.value()
}