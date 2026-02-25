const db = require("../db/db")
const { submitApplication, updateHandlingStatus,  updateApplication, getApplication } = require("../repository/applicationQuery")


const applicationStat = {
    UNHANDLED: "UNHANDLED",
    ACCEPTED: "ACCEPTED", 
    REJECTED: "REJECTED"
}

const COMPETENCE_TYPE_MAP ={
    "ticket sales": 1,
    "lotteries": 2,
    "roller coaster operator": 3
}

const ID_TO_COMPETENCE_MAP = {
    1: "ticket sales",
    2: "lotteries",
    3: "roller coaster operator"
}
/**
 * hur application hanteras och sätts styrs härifrån
 * 

 * 
 */
class Application{

    constructor(applicationDTO){
        this.competenceProfile = applicationDTO.competenceProfile
        this.availability = applicationDTO.availability
        this.handlingState=applicationStat.UNHANDLED

    }

    /**
     * sätter hanldingStat till accepterad
     */
    accept(){
        this.handlingState=applicationStat.ACCEPTED
    }


    /**
     * sätter handlingStat till rejected
     */
    reject(){
        this.handlingState = applicationStat.REJECTED
    }

    /**
     * denna funktion mappar competenceType så som vi har det i databasen
     * @param {competence} type den typ av competence som individen har
     * @returns ett siffer id som motsvarar competenceType
     */
    mapCompetenceToId(type){
        const id = COMPETENCE_TYPE_MAP[type.toLowerCase()]
        if(!id) throw new Error(`Invalid competence type: ${type}`)

            return id
        }


    /**
     * denna funktion ser till så att DTO värdena ändras 
     * @param {type, time} competenceProfile består av två element, typ av competence och years_of_experience
     * @returns 
     */
    mapCompetenceProfileToDB(competenceProfile){
        return competenceProfile.map(c=> ({
            competence_id: this.mapCompetenceToId(c.competenceType),
            years_of_experience: c.competenceTime
        }))
    }   

    /**
     * this function converts from number id
     * to competence
     * @param {type, competence} type 
     * @returns name of competence
     */
    mapIdToCompetence(id){
        const competence = ID_TO_COMPETENCE_MAP[id]

        if(!competence){
            throw new Error(`Invalid competence id: ${id}`)
        }

        return competence
    }

    /**
     * this function does the mapping to correct
     * front end format
     * @param {type, competence} competenceProfile 
     * @returns correctly formatted competence
     */
    mapCompetenceProfileFromDB(competenceProfile){
        return competenceProfile.map(c=> ({
            competenceType: this.mapIdToCompetence(c.competence_id),
            competenceTime: String(c.years_of_experience)
        }))
    }   

/**
 * denna funktion skapar i databasen competence_profile 
 * och availability baserat på vad användaren har knappat in på
 * frontend delen
 * @param {*} applicationDTO relevant information från användaren
 * @returns ifall uppdatering lyckades samt person_id
 */
    async applicationSubmission(applicationDTO){
        //denna funktion kanske ska delas upp till updateDTO och ApplicationSubmission
        try{
            const mappedCompetences = this.mapCompetenceProfileToDB(applicationDTO.competenceProfile)

            const updateDTO = {
                ...applicationDTO,
                competenceProfile: mappedCompetences
            }


            
            return await submitApplication(updateDTO)
            }catch (error){
                return{
                    success: false,
                    error: error.message
                }
            }
        }   
/**
 * denna funktion ändrar handlingstatus i databasen till ACCEPTED
 * @param {*} applicationDTO information från användare
 * @returns ifall uppdateringen lyckades samt person_id
 */
    async acceptApplication(applicationDTO){
        try{
            this.accept()
            return await updateHandlingStatus(this.handlingState, applicationDTO)
        }catch(error){
            return {
                success: false,
                error: error.message
            }
        }

    }
/**
 * denna funktion ändrar handlingstatus i databasen till REJECTED
 * @param {*} applicationDTO information från användare
 * @returns ifall vi uppdateringen lyckades samt person_id
 */
    async rejectApplication(applicationDTO){
        try{
            return await updateHandlingStatus(applicationStat.REJECTED, applicationDTO)
        } catch(error){
            return{
                success: false,
                error: error.message
            }
        }
    }

    /**
     * denna funktion säger till repository att fråga
     * databasen om relevant application info
     * @param {*} applicationDTO används för person_id
     * @returns competenceProfile och availability
     */
    async getApplication(applicationDTO){
        try{
            const res = await getApplication(applicationDTO)
            if(!res.success) return res

            if(!res.competenceProfile || !res.availability){
                return {
                    success: false,
                    availability:[],
                    competenceProfile: [],
                }
            }
            const mappedCompetences = this.mapCompetenceProfileFromDB(res.competenceProfile)            

            return {
                success:true,
                availability: res.availability,
                competenceProfile: mappedCompetences
            }
        }catch(error){
            return{
                success:false,
                error: error.message
            }
        }
    }
}





module.exports = {Application}