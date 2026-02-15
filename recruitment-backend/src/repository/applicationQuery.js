const db = require("../db/db")

/**
 * denna funktion skapar sql queryn som skapar en ny ansökan
 * relevanta fält uppdateras
 */
async function submitApplication(applicationDTO){
    const client = await db.connect();
    try{
        await client.query("begin")
        await createCompetenceProfile(client, applicationDTO)
        await createAvailability(client, applicationDTO)
        await client.query(`insert into person_application_status (person_id, status) values ($1, 'UNHANDLED');`,
        [applicationDTO.person_id])
        await client.query("commit")

        return{
            success: true,
            person_id: applicationDTO.person_id
        }
    }catch (err){
        await client.query("rollback")
        console.error("database fail: ", err)
        return{
            success: false,
            error: err.message
        }
    } finally {
        client.release()
    }
}


/**
 * hjälpar funktion som skapar en ny competence profile  
 * 
 * @param {*} client databasklienten som vi pratar med
 * @param {*} applicationDTO användarinfo 
 */
async function createCompetenceProfile(client, applicationDTO){
    for(const competence of applicationDTO.competenceProfile){
        await client.query(`insert into competence_profile (person_id, competence_id, years_of_experience) values ($1, $2, $3);`,
        [applicationDTO.person_id, competence.competence_id, competence.years_of_experience])
    }
}
/**
 * hjälpar funktion som skapar en ny availability entry
 * @param {*} client dabasklienten som vi pratar med
 * @param {*} applicationDTO användarinfo
 */
async function createAvailability(client, applicationDTO){
    for(const availability of applicationDTO.availability){
        await client.query(`insert into availability (person_id, from_date, to_date) values ($1, $2, $3);`,
        [applicationDTO.person_id, availability.from, availability.to])
    }
}

/**
 * uppdaterar handling status för relevant person
 * @param {*} status den status vi ska ändra till
 * @param {*} applicationDTO användarinfo
 * @returns ifall vi lyckas och person_id, eller error meddelande
 */
async function updateHandlingStatus(status, applicationDTO){
    const client = await db.connect()
    try{
        await client.query(`update person_application_status set status=$1 where person_id=$2;`, 
        [status, applicationDTO.person_id]
        )
        return{
            success: true,
            person_id: applicationDTO.person_id
        }
    }catch(error){
        await client.query("rollback;")
        return{
            success: false,
            error: error.message
        }

    }

}

module.exports = { submitApplication, updateHandlingStatus}