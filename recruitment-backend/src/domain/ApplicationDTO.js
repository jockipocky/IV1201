class ApplicationDTO{
    constructor({ person_id, competenceProfile, availability, handlingStat}){
        this.person_id = person_id //kan hända att detta måste ändras, idk
        this.competenceProfile = competenceProfile
        this.availability = availability
        this.handlingStat = handlingStat
    }
}

module.exports = ApplicationDTO