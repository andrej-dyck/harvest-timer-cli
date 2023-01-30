import requiredEnv from '../utils/required-env.js'
import lazy from '../utils/lazy.js'
import got, { Options } from 'got'
import cache from '../utils/cache.js'
import dayjs from 'dayjs'

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

    latest: (user_id, params = {}) =>
        time.entries(user_id, { ...params, per_page: 1 }).then((entries) => entries[0]),

    stop: ({ id }) =>
        harvest.patch(`v2/time_entries/${id}/stop`),

    restart: ({
        id,
        spent_date,
        user: { id: user_id },
        project: { id: project_id },
        task: { id: task_id },
        notes
    }) => {
        const today = dayjs().format('YYYY-MM-DD')
        return spent_date === today
            ? harvest.patch(`v2/time_entries/${id}/restart`)
            : harvest.post('v2/time_entries', { user_id, project_id, task_id, spent_date: today, notes })
    }

}

const users = {
    me: async () => await harvest.get(`v2/users/me`)
}

export default { projects, time, users }