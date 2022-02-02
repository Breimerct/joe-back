import app from './src/app';
import connect from './src/db/connection'

async function main (): Promise<void> {
    await app.listen(app.get('port'))
}
connect()
    .then(main)
    .then(() => {
        console.log(`http://localhost:${app.get('port')}`)
    })
    .catch(e => {
        console.error("Error!", e)
    })
