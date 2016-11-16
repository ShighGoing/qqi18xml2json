const fs = require('fs');
const expat = require('node-expat')
var parser = new expat.Parser('UTF-8')

function main () {
    process.argv.forEach((val, index) => {
        if (index > 1) {
            parseFile(val)
        }
    })
}

function parseFile (path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        parser.on('startElement', (name, attrs) => {
            objectStructure.add(name, attrs)
        })
        parser.write(data) // sync
        output(objectStructure.areas)
    })
}

function output (path, data) {
    fs.writeFile('path', JSON.stringify(data), (err) => {
        if (err) throw err
    })
}

var objectStructure = {
    areas: null,
    curCountry: null,
    curState: null,
    curCity: null,
    add: function (name, attrs) {
        if (!this.areas) this.areas = []
        if (name === 'CountryRegion') {
            this.curCountry = {}
            if (attrs) {
                this.curCountry.name = attrs.Name
                this.curCountry.code = attrs.Code
            }
            this.areas.push(this.curCountry)
        } else if (name === 'State') {
            this.curState = {}
            if (attrs) {
                this.curState.name = attrs.Name
                this.curState.code = attrs.Code
            }
            if (!this.curCountry) throw new Error()
            if (!this.curCountry.states) this.curCountry.states = []
            curCountry.states.push(curState)
        } else if (name === 'City') {
            this.curCity = {}
            if (attrs) {
                this.curCity.name = attrs.Name
                this.curCity.code = attrs.Code
            }
            if (!this.curState) throw new Error()
            if (!this.curState.citys) this.curState.citys = []
            this.curState.citys.push(curCity)
        }
    }
}
