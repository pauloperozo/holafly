//////////////////////////////////////////////////////////////////////////////
const _isWookieeFormat = ( req ) => {

    if(req.query.format && req.query.format == 'wookiee')return true
    return false
}
//////////////////////////////////////////////////////////////////////////////
const test = async ( req , res, app ) => {

    const data = await app.swapiFunctions.genericRequest('https://swapi.dev/api/', 'GET', null, true)
    res.json(data)

}
//////////////////////////////////////////////////////////////////////////////
const getPeople = async ( req , res ) => { }
//////////////////////////////////////////////////////////////////////////////
const getPlanet = async ( req , res ) => {

    const { id } = req.params

    const { Planet } = require('../../app/Planet')
    const planet = new Planet( id )
    await planet.init()
    
    if( !planet.name )return res.status(400).json( {message:"Planeta No Existente..."} )

    const response =  { name: planet.getName(), gravity: planet.getGravity() }
    return res.json( response ) 

}
//////////////////////////////////////////////////////////////////////////////
const getWeightOnPlanetRandom = async ( req , res ) => { }
//////////////////////////////////////////////////////////////////////////////
const getLogs = async ( req , res , app ) => {

    const fields = ['action', 'header','ip']
    const logs = await app.db.logging.findAll( { attributes: fields } )
    res.json( logs )
}
//////////////////////////////////////////////////////////////////////////////
module.exports = { test,getPeople , getPlanet, getWeightOnPlanetRandom,getLogs }
//////////////////////////////////////////////////////////////////////////////