import { path, fs } from 'zx'
import lazy from './utils/lazy.js'

const projectsConfig = lazy(async () =>
    await readConfig('projects.json', {
        ignored: {
            __comment: "A set of (exact) project names that will be excluded in prompts",
            names: []
        }
    })
)

const readConfig = async (jsonFile, defaultConfig) => {
    const file = path.join(__dirname, '.config', jsonFile)
    if (!await fs.pathExists(file)) {
        await fs.writeJSON(file, defaultConfig)
    }
    return await fs.readJson(file)
}

export default {
    readProjects: () => projectsConfig.value()
}
