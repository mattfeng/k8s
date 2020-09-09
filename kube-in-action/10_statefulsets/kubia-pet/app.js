const http = require('http')
const os = require('os')
const fs = require('fs')

const dataFile = '/var/data/kubia.txt'

function fileExists(file) {
    try {
        fs.statSync(file)
        return true
    } catch (e) {
        return false
    }
}

var handler = function(req, resp) {
    if (req.method == 'POST') {
        var file = fs.createWriteStream(datafile)
        file.on('open', function() {
            req.pipe(file)
            console.log('New data has been received and stored.')
            resp.writeHead(200)
            resp.end(`Data stored on pod ${os.hostname()}\n`)
        })
    } else {
        var data = fileExists(dataFile) ?
            fs.readFileSync(dataFile, 'utf8') : 
            "No data posted yet"
        resp.writeHead(200)
        resp.write(`You've hit ${os.hostname()}\n`)
        resp.end(`Data stored on this pod: ${data}\n`)
    }
}

var www = http.createServer(handler)
www.listen(8080)

