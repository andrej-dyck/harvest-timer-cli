import z from 'zod'
import { fs, path } from 'zx'
import lazy from './utils/lazy.js'

const projectsConfig = lazy(() =>
    readConfig('projects.json', z.object({
        ignored: z.object({
            names: z.array(z.string())
        })
    }), {
        ignored: {
            __description: 'A set of (exact) project names that will be excluded from prompts',
            names: []
        }
    })
)

const readConfig = async (jsonFile, schema, defaultConfig) => {
    const file = path.join(__dirname, '.config', jsonFile)
    if (!await fs.pathExists(file)) {
        await fs.writeJSON(file, defaultConfig)
    }
    return schema.parse(await fs.readJson(file))
}

export default {
    readProjects: () => projectsConfig.value()
}
