//////////////////////////////////////////////////////////////////////////////
const _wrape = ( handler, app ) => {

    return async ( req , res ) => {

        try {
          await handler(req, res, app )
        } 
        catch (error) {
          console.error( error )
          res.status(500).send('Internal Server Error')
        }

    }
}
//////////////////////////////////////////////////////////////////////////////
const applySwapiEndpoints = ( server, app ) => {

    const { test, getPeople, getPlanet, getWeightOnPlanetRandom,getLogs } = require('../controllers/hfswapictr')

    server.get('/hfswapi/test', _wrape( test, app ))
    server.get('/hfswapi/getPeople/:id([0-9]+)', getPeople )
    server.get('/hfswapi/getPlanet/:id([0-9]+)', getPlanet )
    server.get('/hfswapi/getWeightOnPlanetRandom', getWeightOnPlanetRandom )
    server.get('/hfswapi/getLogs', _wrape( getLogs, app ) )

}
//////////////////////////////////////////////////////////////////////////////
module.exports = applySwapiEndpoints
//////////////////////////////////////////////////////////////////////////////