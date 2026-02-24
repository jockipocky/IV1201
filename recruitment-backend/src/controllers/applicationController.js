const ApplicationDTO = require("../domain/ApplicationDTO");
const UserDTO = require("../domain/UserDTO");
const { Application } = require("../services/applicationService");
const authService = require("../services/authService");

/**
 * denna funktion dubbellkollar så att sanvändaren har fyllt 
 * in formuläret i korrekt format och skickar sedan det vidare
 * till service
 * @param {*} req innehåller competenceProfile och availability
 * @param {*} res resultatet blir en check
 * @returns    status på förfrågan beroende på hur allt blev
 */
async function applicationSubmission(req,res){
    try{
        const dto = new ApplicationDTO(req.body)
        const application = new Application(dto)

        if(
            dto.competenceProfile.length === 0  || 
            dto.availability.length === 0 
            ){
                return res.status(400).json({
                    ok:false,
                    error:"All fields must be filled"
                })
        }

        const result = await application.applicationSubmission(dto)

        if(!result.success){
            return res.status(401).json({
                ok: false,
                error: "All fields must be filled"
            })
        }
        
        return res.status(200).json(result);
    }catch(err){
        console.error("APPLICATION SUBMISSION ERROR: ", err)
        return res.status(500).json({ok: false, error: "Server Error"})
    }
}

/**
 * denna funktion ska hämta relevant information
 * baserat på person_id
 * @param {*} req body innehåller person_id
 * @param {*} res json body med relevant info
 * @returns competenceProfile samt availability
 */
async function fetchApplication(req, res){
    try{
        const {person_id} = req.params
        if(!person_id){
            return res.status(400).json({
                ok: false,
                error: "no person_id provided"
            })
        }
        const application = new Application({})
        const result = await application.getApplication({person_id})

        console.log("controller result: ", result)

        return res.status(200).json(result)
    }catch(error){
        console.error("ERROR: ", error)
        return res.status(500).json({
            ok: false,
            error: "server error"
        })
    }
}

 async function updatePI(req, res) {
    try{
        const dto = new UserDTO(req.body)

        if(!dto.lastName || !dto.email ||
            !dto.firstName || !dto.personalNumber) {
            return res.status(400).json({
                ok: false,
                error: "please fill in the complete form"
            })
        }
        
        const result = await authService.updatePI(dto);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

            return res.status(200).json({
                success: true,
                message: "profile updated"
            });

    }catch(error){
        console.error("Error: ", error)
        return res.status(500).json({
            ok: false,
            error: "server error"
        })
    }
    
 }



 module.exports = {
    applicationSubmission, 
    fetchApplication,
    updatePI
};