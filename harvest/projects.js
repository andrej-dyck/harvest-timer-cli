import lazy from '../utils/lazy.js'
import api from './api.js'
import pick from '../utils/pick.js'

const projects = lazy(async () =>
    (await api.projects.mine()).map(({ project, task_assignments }) => ({
            project: pick(project, ['id', 'name', 'code']),
            tasks: task_assignments
        })
    )
)

const filterCurrent = (projects) => {
    // const ignore = [/* TODO read from config */]
    // return projects.filter(({ project }) => !ignore.find((n) => project.name.includes(n)))
    return projects
}

export default {
    current: () => projects.value().then(filterCurrent)
}