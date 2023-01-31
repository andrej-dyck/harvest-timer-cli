import dayjs from 'dayjs'
import { chalk } from 'zx'

import actionRestartTimer from './harvest/action-restart-timer.js'
import actionShowDay from './harvest/action-show-day.js'
import actionStartTimer from './harvest/action-start-timer.js'
import actionStopTimer from './harvest/action-stop-timer.js'
import api from './harvest/api.js'

import prompt from './utils/prompt.js'

const promptLoop = async ({ user_id }) => {
    const today = dayjs().startOf('day')

    // noinspection InfiniteLoopJS - intendet; exit script with ctrl+c
    while (true) {
        const { latest: latestEntry } = await actionShowDay.run({ user_id, day: today })

        console.log()
        await runAction(
            await chooseAction({ latestEntry }),
            { user_id, latestEntry }
        )
        console.log()
    }
}

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

const runAction = async (action, { user_id, latestEntry }) => {
    const script = {
        'start': { $: () => actionStartTimer.run() },
        'stop': { $: () => actionStopTimer.run({ entry: latestEntry }) },
        'continue': { $: () => actionRestartTimer.run({ user_id, noEntryToday: !latestEntry }) },
    }[action] ?? {
        $: () => console.error(chalk.red('🤷‍♀️️ unknown action'))
    }

    await script.$()
}

export default {
    run: async () => {
        /** Welcome */
        const { id: user_id, first_name } = await api.users.me()
        console.log(`👋 Hello, ${first_name} (${user_id})\n`)

        /* Main Loop */
        await promptLoop({ user_id })
    }
}