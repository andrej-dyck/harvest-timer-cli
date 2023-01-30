const pick = (object, keys) =>
    Object.fromEntries(
        Object.entries(object).filter(([k, _]) => keys.includes(k))
    )

export default pick