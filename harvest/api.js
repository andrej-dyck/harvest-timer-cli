import dayjs from 'dayjs'
import got, { Options } from 'got'

import cache from '../utils/cache.js'
import lazy from '../utils/lazy.js'
import once from '../utils/once.js'
import requiredEnv from '../utils/required-env.js'

once.initSync('dayjs-is-today', () => {
    dayjs.extend(require('dayjs/plugin/isToday'))
})

const apiOptions = lazy(async () => new Options({
    prefixUrl: 'https://api.harvestapp.com',
    headers: {
        'Harvest-Account-ID': await requiredEnv('HARVEST_ACCOUNT_ID'),
        'Authorization': `Bearer ${await requiredEnv('HARVEST_API_TOKEN')}`
    },
}))

const harvest = {
    get: async (resource, searchParams = {}) =>
        cache.valueOrCreate('harvest', resource,
            async () => got(resource, { searchParams }, await apiOptions.value()).json(),
            ['v2/time_entries']
        ),

    patch: async (resource) =>
        got(resource, { method: 'patch' }, await apiOptions.value()).json(),

    post: async (resource, json) =>
        got(resource, { method: 'post', json }, await apiOptions.value()).json()
}

const projects = {
    mine: async (params = {}) =>
        harvest.get(`v2/users/me/project_assignments`, { ...params, is_active: true })
            .then(({ project_assignments }) => project_assignments),
}

const time = {
    entries: async (user_id, params = {}) =>
        harvest.get('v2/time_entries', { ...params, user_id })
            .then(({ time_entries }) => time_entries),

    stop: ({ id }) =>
        harvest.patch(`v2/time_entries/${id}/stop`),

    startNow: (user_id, { project_id, task_id, notes }) => {
        const today = dayjs().format('YYYY-MM-DD')
        return harvest.post('v2/time_entries', { user_id, project_id, task_id, spent_date: today, notes })
    },

    restart: ({ id, spent_date, user: { id: user_id }, project: { id: project_id }, task: { id: task_id }, notes }) =>
        dayjs(spent_date).isToday()
            ? harvest.patch(`v2/time_entries/${id}/restart`)
            : time.startNow(user_id, { project_id, task_id, notes })

}

const users = {
    me: async () => await harvest.get(`v2/users/me`)
}

export default { projects, time, users }