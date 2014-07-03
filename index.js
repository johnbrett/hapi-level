var Level = require('level')
var db = Level('./data')

exports.register = function(plugin, options, next) {
	plugin.expose('db', db)
	next()
}

exports.register.attributes = {
    pkg: require("./package.json")
}