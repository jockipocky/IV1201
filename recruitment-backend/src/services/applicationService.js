
/**
 * 
 * Denna klas hanterar och sorterar applications i listor
 */
class applicationService{
    constructor(){
        this.applications = []
    }


    /**
     * tar emot application dto som ska skapas någonstans (vet ej vart)
     * skapar en ny application, och lägger det i listan av applications
     * @param applicationDTO: data objekt med metadata om application
     * @returns objektet application
     * 
     */

    createApplication(applicationDTO){
        const applicationDTO = new application(applicationDTO)
        this.applications.push(application)
        return application
    }

}