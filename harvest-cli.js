import dayjs from 'dayjs'
import { chalk } from 'zx'

import actionRestartTimer from './harvest/action-restart-timer.js'
import actionShowDay from './harvest/action-show-day.js'
import actionStartTimer from './harvest/action-start-timer.js'
import actionStopTimer from './harvest/action-stop-timer.js'
import api from './harvest/api.js'

import clearConsole from './utils/clear-console.js'
import prompt from './utils/prompt.js'

const promptLoop = async ({ user_id, user_name }) => {
    const today = dayjs().startOf('day')

    // noinspection InfiniteLoopJS - intended; exit script with ctrl+c
    while (true) {
        clearConsole()

        console.log(`👋 Hello, ${user_name}\n`)
        const { latest: latestEntry } = await actionShowDay.run({ user_id, day: today })

        console.log()
        await runAction(
            await chooseAction({ latestEntry }),
            { user_id, latestEntry }
        )
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
        'start': { run: () => actionStartTimer.run() },
        'stop': { run: () => actionStopTimer.run({ entry: latestEntry }) },
        'continue': { run: () => actionRestartTimer.run({ user_id, noEntryToday: !latestEntry }) },
    }[action] ?? {
        run: async () => ({ output: chalk.red('🤷‍♀️️ unknown action') })
    }

    const result = await script.run()
    if (!!result?.output) {
        console.log(`\n▶ ${result.output}`)
        await sleep(1000)
    }
}

export default {
    run: async () => {
        /** Welcome */
        const { id: user_id, first_name } = await api.users.me()

        /* Main Loop */
        await promptLoop({ user_id, user_name: first_name })
    }
}