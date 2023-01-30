const lazy = (init) => {
    let value
    return {
        value: async () => {
            if (!value) {
                value = await init()
            }
            return value
        }
    }
}

export default lazy