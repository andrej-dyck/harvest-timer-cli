import lazy from '../utils/lazy.js'
import pick from '../utils/pick.js'
import api from './api.js'

const projects = lazy(async () =>
    (await api.projects.mine()).map(
        ({ project, task_assignments }) => ({
            ...pick(project, ['id', 'name', 'code']),
            tasks: task_assignments.map(({ task }) => task).sort(byName)
        })
    ).sort(byName)
)

const byName = ({ name: n1 }, { name: n2 }) => n1 > n2 ? 1 : n1 < n2 ? -1 : 0

const filterCurrent = (projects) => {
    // const ignore = [/* TODO read from config */]
    // return projects.filter(({ name }) => !ignore.find((n) => name.includes(n)))
    return projects
}

export default {
    current: () => projects.value().then(filterCurrent)
}