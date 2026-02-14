const db = require("../db/db")

async function submitApplication(applicationDTO){
    const client = await db.connect();
    try{
        await client.query("begin")
        await client.query('instert into competence_profile (person_id, competence_id, years_of_experience) values ')
    }
}