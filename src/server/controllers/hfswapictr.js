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
const getPeople = async ( req , res ) => {

    const { id } = req.params

    const { peopleFactory } = require('../../app/People')
    const wookiee = _isWookieeFormat( req )

    const people = await peopleFactory( id, wookiee ? "wookiee":"")
    if( !people.name ) return res.status(400).json( {message:"Personaje No Existente..."} )

    const response = {
        name : people.getName(), 
        mass : people.getMass(),
        height : people.getHeight(),
        homeworldName : people.getHomeworldName(),
        homeworldId : people.getHomeworlId(),
    }

    return res.status(200).json( response ) 

}
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
const getWeightOnPlanetRandom = async ( req , res ) => {

    const RamdomId = ( min, max ) => Math.floor( Math.random() * (max - min + 1) + min) 

    const PeopelId = RamdomId( 1,82 ) /* Numero De Personas Mostrada Api */
    const PlanetId = RamdomId( 1,60 ) /* Numero De Planeta Mostrada Api */


    const { peopleFactory } = require('../../app/People')
    const people = await peopleFactory( PeopelId,"")
    if( !people.name ) return res.status(400).json( {message:"Personaje No Existente..."} )

    try {

        const result = await people.getWeightOnPlanet( PlanetId )
        return res.json( result.getWeightOnPlanet ) 

    } catch (error) {
        return res.status(400).json( { message:error.message } )     
    }

}
//////////////////////////////////////////////////////////////////////////////
const getLogs = async ( req , res , app ) => {

    const fields = ['action', 'header','ip']
    const logs = await app.db.logging.findAll( { attributes: fields } )
    res.json( logs )
}
//////////////////////////////////////////////////////////////////////////////
module.exports = { test,getPeople , getPlanet, getWeightOnPlanetRandom,getLogs }
//////////////////////////////////////////////////////////////////////////////