class ApplicationDTO{
    constructor({applicationID, personalInfo, competenceProfile, availability, handlingStat}){
        this.applicationID = applicationID
        this.personalInfo = personalInfo
        this.competenceProfile = competenceProfile
        this.availability = availability
        this.handlingStat = handlingStat
    }
}

module.exports = ApplicationDTO