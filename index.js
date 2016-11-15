const fs = require('fs');
const expat = require('node-expat')

var parser = new expat.Parser('UTF-8')
var countryObj = {}
var countryArr = []
var namespaces = []
var areas
var path = './LocList.xml'
fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    parser.on('startElement', (name, attrs) => {
        //console.log(name, attrs)
	genCountries(name, attrs)
        parseEles(0, attrs)
    })
    parser.on('endElement', (name) => {
        //console.log(name)
        parseEles(1)
    })
    parser.on('close', () => {
        console.log(areas.subs[1].subs)
    })
    parser.end(data)
})

function parseEles (type, attrs) {
    if (type === 0) { // start
        if (!areas) {
            areas = {}
            return
        }
        let curObj = areas
        namespaces.forEach((level) => {
           curObj = curObj.subs[level]
        })
        if (!curObj.subs) {
            curObj.subs = {}
        }
        let code = attrs && attrs.Code || '_'
        curObj.subs[code] = {
            name: attrs.Name,
            code: attrs.Code
        }
        namespaces.push(attrs && attrs.Code || '_')
    } else if (type === 1) {
    	namespaces.pop()
    }
}

function genCountries(name, attrs) {
    if (name !== 'CountryRegion') {
        return
    }
    countryObj[attrs.Code] = attrs
}
