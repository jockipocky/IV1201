class ApplicationDTO{
    constructor({ person_id, competences, availability, handlingState}){
        this.person_id = person_id //kan hända att detta måste ändras, idk
        this.competenceProfile = Array.isArray(competences) 
        ? competences.map(c => ({
            competenceType: c.competenceType,
            competenceTime: Number(c.competenceTime)
        })) :[]
        this.availability = Array.isArray(availability)
         ?availability.map(a=> ({
            from: a.from,
            to: a.to
         })) : []
        this.handlingState = handlingState || "unhandled"
    }
}

module.exports = ApplicationDTO