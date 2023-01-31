#! /usr/bin/env node

import harvestCli from './harvest-cli.js'
import bash from './utils/bash.js'

await bash.init({ useGitBash: true })
await harvestCli.run()
