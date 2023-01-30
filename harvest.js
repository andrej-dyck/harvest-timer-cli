#! /usr/bin/env node

import { chalk } from 'zx'
import dayjs from 'dayjs'

import bash from './utils/git-bash.js'
import dotenv from './utils/dotenv.js'
import prompt from './utils/prompt.js'

import api from './harvest/api.js'
// import harvestProjects from './harvest/projects.js'
import timeEntries from './harvest/time-entries.js'
import actionRestartTimer from './harvest/action-restart-timer.js'
import actionStopTimer from './harvest/action-stop-timer.js'
import actionShowDay from './harvest/action-show-day.js'

await bash.init()
await dotenv.read()

/** Welcome */
const { id: user_id, first_name } = await api.users.me()
console.log(
    `👋 Hello, ${first_name} (${user_id})\n`
)

const today = dayjs().startOf('day')
const latestEntry = await timeEntries.latest({ user_id, day: today })
console.log(
    (!!latestEntry ? timeEntries.format.summary(latestEntry) : chalk.green('🌄 A fresh day ...')) + '\n'
)

/** Action? */
const actions = ['start new', 'continue with ...', 'show today']
if (latestEntry?.['is_running'] === true) actions.unshift('stop running')

const { action } = await prompt.ask(
    prompt.question.select({
        name: 'action',
        message: '🎬 What would you like to do?',
        choices: actions
    })
)

if (action.startsWith('start')) {
    console.error(chalk.red('TODO')) // TODO
} else if (action.startsWith('stop')) {
    await actionStopTimer.run({ entry: latestEntry })
} else if (action.startsWith('continue')) {
    await actionRestartTimer.run({ user_id })
} else if (action.startsWith('show')) {
    await actionShowDay.run({ user_id, day: today })
} else {
    console.error(chalk.red('🤷‍♀️️ unknown action'))
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