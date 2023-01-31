export default function (init) {
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