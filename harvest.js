#! /usr/bin/env node

import { chalk } from 'zx'

import bash from './utils/git-bash.js'
import dotenv from './utils/dotenv.js'

import prompt from './utils/prompt.js'
import api from './harvest/api.js'
// import harvestProjects from './harvest/projects.js'
import timeEntries from './harvest/time-entries.js'
import actionStopTimer from './harvest/action-stop-timer.js'
import actionRestartTimer from './harvest/action-restart-timer.js'

await bash.init()
await dotenv.read()

const { id: user_id, first_name } = await api.users.me()

console.log(`👋 Hello, ${first_name} (${user_id})\n`)

const latestEntry = await timeEntries.latest(user_id) ?? {}
console.log(timeEntries.format.summary(latestEntry))



/** Action? */
const actions = latestEntry['is_running'] === true
    ? ['stop running', 'start new', 'continue with ...']
    : ['start new', 'continue with ...']

const { action } = await prompt.ask(
    prompt.question.select({
        name: 'action',
        message: '🎬 What would you like to do?',
        choices: actions
    })
)

/** Action: new */
if (action.startsWith('start')) {
    console.log(chalk.red('TODO'))
}
/** Action: stop */
else if (action.startsWith('stop')) {
    await actionStopTimer.run({ entry: latestEntry })
}
/** Action: continue */
else if (action.startsWith('continue')) {
    await actionRestartTimer.run({ user_id })
}
/* unknown action */
else {
    console.error(chalk.red('🤷‍♂️ unknown action'))
}

// // TODO EXPERIMENTING HERE
// const projects = await harvestProjects.current()
// const { project } = await prompt.ask(
//     prompt.question.select({
//         name: 'project',
//         message: 'project',
//         choices: namedChoices(projects, ({ project }) => project.name)
//     })
// )
//
// console.log(project)