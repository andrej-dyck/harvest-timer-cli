// // TODO
// const projects = await harvestProjects.current()
// const { project } = await prompt.ask(
//     prompt.question.select({
//         name: 'project',
//         message: 'project',
//         choices: namedChoices(projects, ({ project }) => project.name)
//     })
// )

import { chalk } from 'zx'

export default {
    run: () => {
        console.error(chalk.red('TODO start timer action'))
    }
}