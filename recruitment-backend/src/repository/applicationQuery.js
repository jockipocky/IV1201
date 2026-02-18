const db = require("../db/db")

/**
 * denna funktion skapar sql queryn som skapar en ny ansökan
 * relevanta fält uppdateras
 */
async function submitApplication(applicationDTO){
        const client = await db.connect()
    
    try{
        await client.query("begin")
        const hasApplied = await checkForApplication(client, applicationDTO)


        if(hasApplied.exists){

            await deleteAvailability(client, applicationDTO)
            await deleteCompetences(client, applicationDTO)

            //denna kanske är redundant, venne
            await client.query(
                `update person_application_status
                set status='UNHANDLED'
                where person_id=$1`,
                [applicationDTO.person_id])
        }else{ 
            await client.query(`insert into person_application_status (person_id, status) values ($1, 'UNHANDLED');`,
            [applicationDTO.person_id])
        }

        await createCompetenceProfile(client, applicationDTO)
        await createAvailability(client, applicationDTO)

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
        return{
            success: false,
            error: error.message
        }

    } finally{
        client.release()
    }
}
    /**
     * denna hjälp funktion kollar ifall användaren redan har en 
     * application i databasen för korrekt hantering
     *
     * @param {} client den aktuella snacket med databasen
     * @param {*} applicationDTO relevant användarinfo
     * @returns true if records exist else false
     */
    async function checkForApplication(client, applicationDTO){
        

            const result = await client.query(`select * from person_application_status where person_id=$1`, 
                [applicationDTO.person_id])
                return{
                    success: true,
                    exists: result.rows.length > 0
                }
        
    }


    /**
     * hjälpar funktion som raderar competenceProfile
     * för specificerad användare
     * @param {*} client aktuell tråd med databas  
     * @param {*} applicationDTO relevant användarinfo
     */
    async function deleteCompetences(client, applicationDTO){
        await client.query(`delete from competence_profile
                            where person_id = $1;`,[applicationDTO.person_id])
    }

    /**
     *hjälpar funktion som raderar availability
     * för specificerad användare
     * @param {*} client aktuell kommunikation med databas
     * @param {*} applicationDTO relevant användarinfo
     */
    async function deleteAvailability(client, applicationDTO){
        await client.query(`delete from availability
                            where person_id = $1;`,[applicationDTO.person_id])
    }

    /**
     * hjälpar funktion som hämtar alla availability
     * @param {*} client aktuell kommunikation med databas
     * @param {*} applicationDTO relevant användarinfo
     * @returns alla availabilities för relevant person
     */
    async function getAvailability(client, applicationDTO){
        const res= await client.query(`select from_date, to_date 
                            from availability 
                            where person_id = $1;`,
                            [applicationDTO.person_id])

        return res
    }

    /**
     * hjälpar funktion som hämtar alla competenceProfiles 
     * @param {*} client aktuell kommunikation med databas
     * @param {*} applicationDTO relevant användar info
     * @returns all competence profile för relevant person
     */
    async function getCompeteceProfile(client, applicationDTO){
       const res=  await client.query(`select competence_id, years_of_experience 
                            from competence_profile 
                            where person_id = $1;`,
                            [applicationDTO.person_id])
        return res
    }

    /**
     * gör en transaktion där all relevant information 
     * för en viss persons application returneras
     * @param {*} applicationDTO relevant användar info
     * @returns databas entries av competence_profile och availability
     */
    async function getApplication(applicationDTO){
        const client = await db.connect()

        try{
            const hasApplied = await checkForApplication(client, applicationDTO)

            if(hasApplied.exists){
                await client.query("begin")

                const availabilityRes= await getAvailability(client, applicationDTO)
                const competenceRes = await getCompeteceProfile(client, applicationDTO)

                await client.query("commit")
                return{
                    success: true,
                    peron_id: applicationDTO.person_id,
                    availability: availabilityRes.rows,
                    competenceProfile: competenceRes.rows
                }
            } else{
                return{
                    success: true,
                    message: "Person have not finished an application"
                }

            }
        } catch(error){
                await client.query("rollback")
                return{
                    success:false, 
                    error: err.message
                }

            }finally{
                client.release()
            }
}

module.exports = { submitApplication, updateHandlingStatus, getApplication}