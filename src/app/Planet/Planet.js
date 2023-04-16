///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const { db,swapiFunctions } = require('../index')
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Planet {

    constructor( id ) {
        
        this.id = id 
        this.name = null
        this.gravity = null
        this.endpoint = 'https://swapi.dev/api/planets'
    }
    
    async init() {
       
        const db_planet = await db.swPlanet.findByPk( this.id , { attributes: ['name', 'gravity'] } )
        if( db_planet )
        {
            this.name =  db_planet.name
            this.gravity = db_planet.gravity
        } 
        else 
        {

            const url = `${this.endpoint}/${this.id}/`   
            const body = await swapiFunctions.genericRequest( url , 'GET', null)        
            if( !body.hasOwnProperty('name') ) return { success: false }
            
            this.name =  body.name
            this.gravity = Planet.fixGravity( body.gravity ) 

            await db.swPlanet.create(  { id:this.id, name : this.name , gravity:this.gravity }  )

        }
    }
    
    getName() {
        return this.name
    }

    getGravity() {
        return this.gravity
    }

    static fixGravity( str ) {
        
        const words = str.split(" ")
        const index = words.findIndex( word => word == "standard")
        const gravity =  index > -1 ? parseFloat( words[ index -1 ] ) : null
        return gravity
    
    }
    
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = Planet
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////