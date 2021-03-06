const fs = require('fs');
const expat = require('node-expat')
var parser = new expat.Parser('UTF-8')

main()

function main () {
    process.argv.forEach((val, index) => {
        if (index === 2) { // the third parameter is the path to the file
            if (!val) return
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
        output(genOutputDirName(path))
    })
}

function genOutputDirName (inputFilePath) {
    return inputFilePath + '-jsons'
}

function output (dirName) {
    fs.access(dirName, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
            if (err.code === "ENOENT") {
              fs.mkdir(dirName, (err) => {
                if (err) throw err
                execOutput(dirName)
              })
            } else {
              throw err;
            } 
        } else {
            // clear folder
            fs.readdir(dirName, (err, filenameList) => {
                if (err) throw err
                filenameList.forEach((filename) => {
                    fs.unlinkSync(dirName + '/' + filename)
                })
                execOutput(dirName)
            })
        }      
    })
}

function execOutput (dirName) {
    writeJson(dirName + '/location.json', objectStructure.areas) // whole file
    let countryList = []
    objectStructure.areas.forEach((country) => {
        countryList.push({
            name: country.name,
            code: country.code
        })
        writeJson(dirName + '/'  + country.code + '.json', country)
    })
    writeJson(dirName + '/countryList.json', countryList)
}

function writeJson (path, data) {
    fs.writeFile(path, JSON.stringify(data), (err) => {
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
            this.curCountry.states.push(this.curState)
        } else if (name === 'City') {
            this.curCity = {}
            if (attrs) {
                this.curCity.name = attrs.Name
                this.curCity.code = attrs.Code
            }
            if (!this.curState) throw new Error()
            if (!this.curState.citys) this.curState.citys = []
            this.curState.citys.push(this.curCity)
        } else if (name === 'Region') {
            if (!this.curCity) throw new Error()
            if (!this.curCity.regions) this.curCity.regions = []
            this.curCity.regions.push({
                name: attrs.Name,
                code: attrs.Code
            })
        }
    }
}
