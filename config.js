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

const startTimerRulesConfig = lazy(() => {
    const argsSchema = z.object({
        args: z.object({
            project: z.union([
                z.object({ id: z.number() }),
                z.object({ name: z.string() }),
                z.object({ nameContains: z.string() })
            ]),
            task: z.union([
                z.object({ id: z.number() }),
                z.object({ name: z.string() }),
                z.object({ nameContains: z.string() })
            ]),
            notes: z.string().optional().default('')
        })
    })

    const promptSchema = z.object({
        prompt: z.string().min(1),
        type: z.union([
            z.literal('input'),
            z.object({ name: z.literal('input'), defaultInput: z.string().min(1) })
        ]),
        then: z.lazy(() => z.union([promptSchema, argsSchema]))
    })

    return readConfig('start-timer-rules.json', z.object({
        rules: z.array(z.object({
            ruleName: z.string(),
            enabled: z.boolean().optional().default(true),
            start: z.union([promptSchema, argsSchema])
        })).default([])
    }), {
        rules: [{
            ruleName: 'example',
            enabled: false,
            start: {
                prompt: 'notes',
                type: 'input',
                then: {
                    args: {
                        project: { name: 'project name' },
                        task: { nameContains: 'task' },
                        notes: '{0}'
                    }
                }
            }
        }]
    })
})

const readConfig = async (jsonFile, schema, defaultConfig) => {
    const file = path.join(__dirname, '.config', jsonFile)
    if (!await fs.pathExists(file)) {
        await fs.writeJSON(file, defaultConfig)
    }
    return schema.parse(await fs.readJson(file))
}

export default {
    readProjects: () => projectsConfig.value(),
    readStartTimerRules: () => startTimerRulesConfig.value()
}
