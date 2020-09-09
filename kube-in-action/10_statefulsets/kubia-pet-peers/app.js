const http = require('http')
const os = require('os')
const fs = require('fs')
const dns = require('dns')

const dataFile = '/var/data/kubia.txt'
const serviceName = 'kubia.default.svc.cluster.local'
const port = 8080

function fileExists(file) {
    try {
        fs.statSync(file)
        return true
    } catch (e) {
        return false
    }
}

function httpGet(reqOptions, callback) {
    return http.get(reqOptions, function(response) {
        var body = ''
        response.on('data', function(d) { body += d; })
        response.on('end', function() { callback(body); })
    }).on('error', function(e) {
        callback("Error: " + e.message);
    })
}

var handler = function(req, resp) {
    if (req.method == 'POST') {
        var file = fs.createWriteStream(dataFile)
        file.on('open', function() {
            req.pipe(file)
            console.log('New data has been received and stored.')
            resp.writeHead(200)
            resp.end(`Data stored on pod ${os.hostname()}\n`)
        })
    } else {
        resp.writeHead(200)

        if (req.url == '/data') {
            var data = fileExists(dataFile) ?
                fs.readFileSync(dataFile, 'utf8') : 
                "No data posted yet"
            resp.end(data)
        } else {
            resp.write(`You've hit ${os.hostname()}\n`)
            resp.write('Data stored in the cluster:\n')

            dns.resolveSrv(serviceName, function(err, addrs) {
                if (err) {
                    resp.end(`Could not look up DNS SRV records: ${err}`)
                    return
                }
                var numResponses = 0
                if (addrs.length == 0) {
                    resp.end('No peers discovered.')
                } else {
                    addrs.forEach(function(item) {
                        var requestOptions = {
                            host: item.name,
                            port: port,
                            path: '/data'
                        }
                        httpGet(requestOptions, function (data) {
                            numResponses++
                            resp.write(`- ${item.name}: ${data}`)
                            resp.write('\n')

                            if (numResponses == addrs.length) {
                                resp.end()
                            }
                        })
                    })
                }
            })
        }
    }
}

var www = http.createServer(handler)
www.listen(8080)

