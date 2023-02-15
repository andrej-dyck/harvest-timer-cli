const pick = (object, keys) =>
    Object.fromEntries(
        Object.entries(object).filter(([k, _]) => keys.includes(k))
    )

const isEmpty = (object) => Object.keys(object).length === 0

export default { pick, isEmpty }