export default function ({ keepScrollbackHistory } = { keepScrollbackHistory: true }) {
    process.stdout.write(
        keepScrollbackHistory ? '\x1B[H\x1B[2J' : '\x1B[2J\x1B[3J\x1B[H\x1Bc'
    )
}