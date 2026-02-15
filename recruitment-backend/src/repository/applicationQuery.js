const db = require("../db/db")

async function submitApplication(applicationDTO){
    const client = await db.connect();
    try{
        await client.query("begin")
        await updateCompetenceProfile(client, applicationDTO)
        await updateAvailability(client, applicationDTO)
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



async function updateCompetenceProfile(client, applicationDTO){
    for(const competence of applicationDTO.competenceProfile){
        await client.query(`insert into competence_profile (person_id, competence_id, years_of_experience) values ($1, $2, $3);`,
        [applicationDTO.person_id, competence.competence_id, competence.years_of_experience])
    }
}

async function updateAvailability(client, applicationDTO){
    for(const availability of applicationDTO.availability){
        await client.query(`insert into availability (person_id, from_date, to_date) values ($1, $2, $3);`,
        [applicationDTO.person_id, availability.from, availability.to])
    }
}

async function updateHandlingStatus(status){

}

module.exports = { submitApplication}