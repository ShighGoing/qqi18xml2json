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
        // console.log(name, attrs)
	// genCountries(name, attrs)
        // parseEles(0, attrs)
        parseEles2Arr(name, attrs)
    })
    parser.on('endElement', (name) => {
        // console.log(name)
        // parseEles(1)
    })
    parser.end(data)
    output(areas)
})

function output (data) {
    fs.writeFile('./output.json', JSON.stringify(data), (err) => {
        if (err) throw err
    })
}

var curCountry, curState, curCity

function parseEles2Arr (name, attrs) {
    if (!areas) areas = []
    if (name === 'CountryRegion') {
        curCountry = {}
        if (attrs) {
            curCountry.name = attrs.Name
            curCountry.code = attrs.Code
        }
        areas.push(curCountry)
    } else if (name === 'State') {
        curState = {}
        if (attrs) {
            curState.name = attrs.Name
            curState.code = attrs.Code
        }
        if (!curCountry) throw new Error()
        if (!curCountry.states) curCountry.states = []
        curCountry.states.push(curState)
    } else if (name === 'City') {
        curCity = {}
        if (attrs) {
            curCity.name = attrs.Name
            curCity.code = attrs.Code
        }
        if (!curState) throw new Error()
        if (!curState.citys) curState.citys = []
        curState.citys.push(curCity)
    }
}

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
