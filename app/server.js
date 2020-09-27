var express = require('express');
var cli = require('./cli')

let app = express()

app.use(express.static('dist/'))

app.get('/cli', (req, res) => {
    res.setHeader('content-type', 'text/javascript')
    try {
        const result = cli.runSimulation(req.query)
        
        if(result.errors.length == 0) {
            res.status(200)
            res.send(result.dump)
        } else {
            res.status(202)
            result.errors.forEach(error => {
                res.write(error.toString())
                res.write('\n')
            });
            res.end()
        }
    } catch (e) {
        console.error("An unexpected error happened while running simulation in CLI mode : ")
        console.error(e)
        res.status(500)
        res.send(e.message)
    }
})

app.use(function(req, res) {
    res.status(404);
    res.send('404: File Not Found');
});

app.listen(8080)