
import { defineStore } from "pinia";
import { register } from "@/api/authApi";
import { submitApplication } from "@/api/applicationApi";
import { renderToString } from "vue/server-renderer";

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
        },
        handlingState: handlingState.UNHANDLED,
        error: null as string |null,
    }),

      getters:{ //getters accessible to the dom
            /**
             * This returns a function so we can pass an index from the component
             */
            getAvailabilityRange: (state) => {
            return (index: number): (string | null)[] => {
                const a = state.availability[index];
                return a ? [a.from, a.to] : [];
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
        setAvailabilityRange(index: number, range: (string | null)[]) {
            const from = range[0] ?? null;
            const to = range[range.length - 1] ?? null;
            this.availability[index] = { from, to };

            console.log("this.setAvailabilityRange: ", this.availability )
        },

        /**
         * removes an availability element from the array
         * @param index the relevant element that is getting removed
         */
        removeAvailability(index: number){
            this.availability.splice(index,1);
            
        },

        submitApplicationForm(){
            return submitApplication({
                competences: this.competences,
                availability: this.availability,
                handlingState: this.handlingState,
            })
        },





  

  },
});