#! /usr/bin/env node

import dayjs from 'dayjs'
import { chalk } from 'zx'

import actionRestartTimer from './harvest/action-restart-timer.js'
import actionShowDay from './harvest/action-show-day.js'
import actionStopTimer from './harvest/action-stop-timer.js'
import api from './harvest/api.js'
import timeEntries from './harvest/time-entries.js'

import dotenv from './utils/dotenv.js'
import bash from './utils/git-bash.js'
import prompt from './utils/prompt.js'

await bash.init()
await dotenv.read()

const today = dayjs().startOf('day')

/** Welcome */
const { id: user_id, first_name } = await api.users.me()
console.log(
    `👋 Hello, ${first_name} (${user_id})\n`
)

/** Action? */
const chooseAction = ({ latestEntry }) => {
    const isRunning = latestEntry?.['is_running'] === true

    const actions = ['🌟 start new', '🔁 continue with ...']
    if (isRunning) actions.push('🤚 stop running')

    return prompt.ask(
        prompt.question.select({
            name: 'action',
            message: '⌚ Harvest time tracking',
            choices: actions
        })
    ).then(({ action }) => action.split(' ')[1])
}

const runAction = async (action, { user_id, latestEntry, today }) => {
    const script = {
        'start': { $: () => console.error(chalk.red('TODO')) },
        'stop': { $: () => actionStopTimer.run({ entry: latestEntry }) },
        'continue': { $: () => actionRestartTimer.run({ user_id }) },
    }[action] ?? {
        $: () => console.error(chalk.red('🤷‍♀️️ unknown action'))
    }

    await script.$()
}

// noinspection InfiniteLoopJS - intendet; exit script with ctrl+c
while (true) {
    const { latest: latestEntry } = await actionShowDay.run({ user_id, day: today })

    console.log()
    await runAction(
        await chooseAction({ latestEntry }),
        { user_id, latestEntry, today }
    )
    console.log()
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