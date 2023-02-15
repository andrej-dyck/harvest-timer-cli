import { path, fs } from 'zx'
import lazy from './utils/lazy.js'

const projectsConfig = lazy(() =>
    readConfig('projects.json', {
        ignored: {
            __description: "A set of (exact) project names that will be excluded from prompts",
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
