const { randomUUID } = require("crypto")

const applicationStat = {
    UNHANDLED: "unhandled",
    ACCEPTED: "accepted", 
    REJECTED: "rejected"
}



/**
 * hur application hanteras och sätts styrs härifrån
 * 
 * spontant känns det som att vi inte behöver veta alltför mycket 
 * personlig info, mer bara meta data kring ansökningen
 * 
 */
class application{

    constructor(applicationDTO){
        this.competenceProfile = applicationDTO.competenceProfile
        this.availability = applicationDTO.availability
        this.handlingStat=applicationStat.UNHANDLED
        this.applicationID = randomUUID() //inte bästa sättet att ta skapa id. man borde göra en funktion som sätter id, sen låta repository layer ta hand om det när den skapar application instansen i db

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
}




module.exports = application