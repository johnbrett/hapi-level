var Level = require('level')

exports.register = function(plugin, options, next) {

	var data = options.data || './data'
	var db = Level(data)

	plugin.expose('db', db)
	next()
}

exports.register.attributes = {
    pkg: require("./package.json")
}