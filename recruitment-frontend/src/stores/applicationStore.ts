
import { defineStore } from "pinia";
import { register } from "@/api/authApi";
import type { submitApplication } from "@/api/applicationApi";

const handlingState ={
    UNHANDLED: "unhandled",
    REJECTED: "rejected",
    ACCEPTED: "accepted"
    
}

interface personalInfo{
    firstName: string;
    lastname: string;
    email:string;
    personalNumber: string;
}

interface availability{
    from: string;
    to: string;
}


interface ApplicationState{
    competences: string[];
    availability: availability | null;
    personalInfo: personalInfo | null;
    handlingState: string;
    error:string | null;
}

export const useApplicationStore = defineStore("applicationForm", {
    state: () : ApplicationState=> ({ //actual initial state of the values in our store (MODEL)
        competences: [],
        availability: null,
        personalInfo: null,
        handlingState: handlingState.UNHANDLED,
        error: null as string |null,
    }),

    actions: { //actions we can perform on the values in our store
        addEmptyCompetence(){
            this.competences.push("");
        },

        updateCompetence(index: number, value:string){
            this.competences[index] = value
        },

        removeCompetence(index: number){
            this.competences.splice(index, 1);

        },


        async submitApplication(){
            try{
                console.log("testi");
        }     catch(err: any){
            this.error = err.response?.data?.message || "Registering failed, sorry";
        }
  },
  getters:{ //getters accessible to the dom
  }
  },
});