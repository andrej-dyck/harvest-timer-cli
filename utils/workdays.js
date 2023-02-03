const isWorkday = (date) => date.day() > 0 && date.day() < 6

const precedingWorkday = (date) => {
    const previous = date.subtract(1, 'day')
    return isWorkday(previous) ? previous : precedingWorkday(previous)
}

export default { isWorkday, precedingWorkday }