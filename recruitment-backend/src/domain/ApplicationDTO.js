class ApplicationDTO{
    constructor({ personalInfo, competenceProfile, availability, handlingStat}){
        this.personalInfo = personalInfo
        this.competenceProfile = competenceProfile
        this.availability = availability
        this.handlingStat = handlingStat
    }
}

module.exports = ApplicationDTO