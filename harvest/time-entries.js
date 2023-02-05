import dayjs from 'dayjs'
import api from './api.js'

const sortedByStartedTime = (entries) => entries.reverse().sort(
    (e1, e2) => startedTime(e1).diff(startedTime(e2))
)

const startedTime = (entry) =>
    dayjs(entry.spent_date + 'T' + entry.started_time)

const endedTime = (entry) =>
    dayjs(entry.spent_date + 'T' + entry.ended_time)

export default {
    ofDay: ({ user_id, day }) => {
        const dayIsoString = day.format('YYYY-MM-DD')
        return api.time
            .entries(user_id, { from: dayIsoString, to: dayIsoString })
            .then(sortedByStartedTime)
    },

    startedTime,
    endedTime
}