
import { defineStore } from "pinia";
import { register } from "@/api/authApi";
import { submitApplication, fetchApplication , submitPI} from "@/api/applicationApi";
import { renderToString } from "vue/server-renderer";
import { useAuthStore } from "./authStore";

const handlingState ={
    UNHANDLED: "unhandled",
    REJECTED: "rejected",
    ACCEPTED: "accepted"
    
}
const competenceType={
    TICKETSALEs: "ticket sales",
    ROLLERCOASTEROPS: "roller coaster operator",
    LOTTERIES: "lotteries"
}

interface personalInfo{
    firstName: string;
    lastname: string;
    email:string;
    personalNumber: string;
    person_id: string
}

interface availability{
    from: string | null;
    to: string | null;
}

interface competence{
    competenceType: string;
    competenceTime: string;
}


interface ApplicationState{
    competences: competence[];
    availability: availability[];
    personalInfo: personalInfo;
    handlingState: string;
    error:string | null;
    successMessage: string |null
}

export const useApplicationStore = defineStore("applicationForm", {
    state: () : ApplicationState=> ({ //actual initial state of the values in our store (MODEL)
        competences: [],
        availability: [],
        personalInfo: {
        firstName: "",
        lastname: "",
        email: "",
        personalNumber: "",
        person_id: ""
        },
        handlingState: handlingState.UNHANDLED,
        error: null as string |null, 
        successMessage: null,
    }),

      getters:{ //getters accessible to the dom
            /**
             * This returns a function so we can pass an index from the component
             */
        getAvailabilityRange: (state) => {
        return (index: number): (Date | null)[] => {
            const a = state.availability[index];
            if (!a) return [];

            return [
            a.from ? new Date(a.from) : null,
            a.to ? new Date(a.to) : null
            ];
        };
        },
  },

    actions: { //actions we can perform on the values in our store

        /**
         * this function adds another element to the competences array
         */
        addEmptyCompetence(){
            if(this.competences.length >=3) return

            this.competences.push({
                competenceTime: "",
                competenceType: ""
            });
            console.log("addEmptyCompetence gör något")
        },

        /**
         * this functions updates the highlighted competence form 
         * @param index the index of the cell that we want to update
         * @param value the keys inputed to the form
         */
        updateCompetence(index: number, payload: Partial<competence>){
            const competence = this.competences[index]
            if(!competence) return

            if(payload.competenceType!==undefined){
                competence.competenceType = payload.competenceType
            }
            if(payload.competenceTime !== undefined){
                competence.competenceTime = payload.competenceTime
            }
            console.log("competence: ", competence)

        },

        /**
         * this function will remove the relevant competence from the array
         * @param index the index to the element we want to remove
         */
        removeCompetence(index: number){
            this.competences.splice(index, 1);
            console.log("remoceCompetence gör något")
        },

        /**
         * creates a new, empty availability period
         */
        addEmptyAvailability() {
            if(this.availability.length >= 3) return
            //kanske lägga till error eller nått sånt
            this.availability.push({ from: null, to: null });
        },



        /**
         * updates the relevant element of availability
         * @param index the element we want to change
         * @param range the start and end date of the applicants availability
         */
        setAvailabilityRange(index: number, range: (Date | null)[]) {
            const fromDate = range[0] ?? null;
            const toDate = range[range.length - 1] ?? null;

            const from = fromDate ? this.formatDateToSQL(fromDate) : null
            const to = toDate ? this.formatDateToSQL(toDate) : null


            this.availability[index] = { from, to };

            console.log("this.setAvailabilityRange: ", this.availability )
        },

        /**
         * this function formats the chosen availability dates to match the
         * format used in the db
         * @param date the selected date object received from the webbrowser
         * @returns corecctly formated dates
         */
        formatDateToSQL(date: Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        /**
         * removes an availability element from the array
         * @param index the relevant element that is getting removed
         */
        removeAvailability(index: number){
            this.availability.splice(index,1);
            
        },

        async fetchUserInfo(){
            const authStore = useAuthStore();

            if(!authStore.user){
                await authStore.fetchUser();
            }

            if(!authStore.user){
                this.error = "User not logged in";
                return;
            }

            console.log("user when updating from fetchuserinfo: ", authStore.user);
            // bara mappa från authStore
            this.personalInfo = {
                firstName: authStore.user.firstName,
                lastname: authStore.user.lastName,
                email: authStore.user.email,
                personalNumber: authStore.user.personalNumber,
                person_id: authStore.user.person_id
                //eventuellt lägg till så att dem skickar personnummer till a
                //og fetch user i auth
            }
        },

        /**
         * denna funktion ser till att skicka ifylld 
         * information från formuläret till databasen
         * 
         * @returns sets the relevant information and makes sure the database fills in a new entry
         */
        submitApplicationForm(){
            return submitApplication({
                competences: this.competences,
                availability: this.availability,
                handlingState: this.handlingState,
                person_id: this.personalInfo.person_id
            })
        },

        async submitPersonalInfo() {
            this.error = null
            this.successMessage = null

            try{
                const res = await submitPI({
                    firstName: this.personalInfo.firstName,
                    lastName:this.personalInfo.lastname,
                    email: this.personalInfo.email,
                    personalNumber: this.personalInfo.personalNumber,
                    person_id: this.personalInfo.person_id
                })

                if(res.data.success){
                    this.successMessage =" profilen har sparats!"
                    setTimeout(() => {
                        this.successMessage = null;
                    }, 3000);
                } else{
                        this.error = "Något gick fel";
                        this.successMessage = null;
                        setTimeout(() => {
                        this.successMessage = null;
                    }, 3000);
                }
            }catch (error){
                this.error = "kunde inte spara profilen"
            }
        },

        /**
         * denna funktion
         */
        async fetchApplication(){
            try{
                const res = await fetchApplication(this.personalInfo.person_id)
                
                 console.log("application fetch result: ", res);
                if(!res.data.succes){
                    return;
                }

                this.availability = res.data.availability.map((a: any) => ({
                    from: a.from_date,
                    to: a.to_date
                }))

                this.competences = res.data.competenceProfile.map((c: any) => ({
                    competenceType: c.competence_id,
                    competenceTime: String(c.years_of_experience)
                }))
            }catch(e){
                console.log("failed to fetch application: ", e);
                this.error = "could not fetch application"
            }
        }





  

  },
});