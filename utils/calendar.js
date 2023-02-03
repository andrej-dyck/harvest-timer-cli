import dayjs from 'dayjs'

export default {
    today: () => dayjs().startOf('day')
}