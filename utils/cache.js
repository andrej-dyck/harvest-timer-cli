const valueOrCreate = async (api, resource, query, ignoredResources = []) =>
    await read(api, resource)
    ?? query().then((response) => ignoredResources.includes(resource) ? response : save(api, resource, response))

const read = (api, resource) => {
    const file = cacheFile(api, resource)
    if (!fs.pathExistsSync(file)) return undefined
    return fs.readJSON(file, 'utf8')
}

const save = async (api, resource, response) => {
    const file = cacheFile(api, resource)
    await fs.ensureFile(file)
    // noinspection ES6MissingAwait - intended; writing cache shouldn't block interaction
    fs.writeJSON(file, response, 'utf8')
    return response
}

const cacheFile = (api, resource) => {
    const pathParts = resource.split('/')
    const filename = pathParts[pathParts.length - 1] + '.json'
    return path.join(__dirname, '.cache', api, filename)
}

export default { valueOrCreate, read, save }