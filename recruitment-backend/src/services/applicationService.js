const db = require("../db/db")
const { submitApplication } = require("../repository/applicationQuery")


const applicationStat = {
    UNHANDLED: "unhandled",
    ACCEPTED: "accepted", 
    REJECTED: "rejected"
}

const COMPETENCE_TYPE_MAP ={
    "ticket sales": 1,
    "lotteries": 2,
    "roller coaster operator": 3
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
        this.handlingStat=applicationStat.ACCEPTED
    }


    /**
     * sätter handlingStat till rejected
     */
    reject(){
        this.handlingStat = applicationStat.REJECTED
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
    mapCompetenceProfile(competenceProfile){
        return competenceProfile.map(c=> ({
            competence_id: this.mapCompetenceToId(c.competenceType),
            years_of_experience: c.competenceTime
        }))
    }   

    /**
     * denna funktion skapar uppdaterar databasens competence_profile 
     * och availability baserat på vad användaren har knappat in på
     * frontend delen
     * 
     * @param {*} applicationDTO här finns all relevant information som ska läggas in i db
     */
    async applicationSubmission(applicationDTO){
        //denna funktion kanske ska delas upp till updateDTO och ApplicationSubmission
        
        const mappedCompetences = this.mapCompetenceProfile(applicationDTO.competenceProfile)

        const updateDTO = {
            ...applicationDTO,
            competenceProfile: mappedCompetences
        }

        console.log("mappedCompetences: ", mappedCompetences)
        console.log("ApplicationDTO: ", updateDTO)

        return await submitApplication(updateDTO)

        }   
}




module.exports = {Application}