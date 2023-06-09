/////////////////////////////////////////////////////
const AbstractPeople = require('./abstractPeople')
const { db,swapiFunctions } = require('../index')
/////////////////////////////////////////////////////
class CommonPeople extends AbstractPeople {

    constructor(id){
        
        super(id)

        this.id   = id
        this.name = null
        this.mass = null
        this.height = null
        this.homeworldName = null
        this.homeworlId = null

        this.endpoint = 'https://swapi.dev/api/people'

    }

    async init(){
        
        const db_people = await db.swPeople.findByPk( this.id )
        if( db_people )
        {
            this.name = db_people.name
            this.mass = db_people.mass
            this.height = db_people.height
            this.homeworldName = db_people.homeworld_name
            this.homeworlId = db_people.homeworld_id
        } 
        else 
        {

            const url = `${this.endpoint}/${this.id}/` 
            const body = await swapiFunctions.genericRequest( url , 'GET', null)        
            if( !body.hasOwnProperty('name') ) return { success: false }
            

            this.name = body.name
            this.mass = Number( body.mass )
            this.height = Number( body.height )
            this.homeworldName = null
            this.homeworlId = null

            const PlanetId = CommonPeople.getIdFromUrl( body.homeworld )

            const { Planet } = require('../Planet/')
            const planet = new Planet( PlanetId )
            await planet.init()
            if( planet.name )
            {
                this.homeworldName = planet.name
                this.homeworlId = PlanetId
            }

            await db.swPeople.create( { id:this.id,name:this.name,mass: this.mass,height:this.height,homeworld_name:this.homeworldName,homeworld_id:this.homeworlId } )
        }
    }

    async getWeightOnPlanet( planetId ){
           
        const { Planet } = require('../Planet/')
        const planet = new Planet( planetId )
        await planet.init()

        if( !planet.name ) throw new Error(`Planeta No Existente params: ${ JSON.stringify({peopelId:this.id,planetId}) }`)
        if( planetId  == this.homeworld_id ) throw new Error(`No Procede Calculo Para Planeta Natal params: ${ JSON.stringify({peopelId:this.id,planetId}) }`)

        const result = swapiFunctions.getWeightOnPlanet( this.mass, planet.getGravity() )

        if(result) return { success: true, getWeightOnPlanet: { peopelId:this.id,homeworldId:Number(this.homeworlId),planetId,result } }
        else  throw new Error(`Error Calculando Peso Personaje params: ${ JSON.stringify({peopelId:this.id,planetId}) }`)  
    }

    static getIdFromUrl( href ) {
        return href.split('/').filter( n => n !== "").pop()
    } 

}
/////////////////////////////////////////////////////
module.exports = CommonPeople
/////////////////////////////////////////////////////