const ApplicationDTO = require("../domain/ApplicationDTO");
const UserDTO = require("../domain/UserDTO");
const { Application } = require("../services/profileService");
const authService = require("../services/authService");

/**
 *  This function double‑checks that the user has filled
 *  out the form in the correct format and then passes it
 *  on to the service
 *  @param {*} req contains competenceProfile and availability
 *  @param {*} res the result is a check
 *  @returns status of the request depending on how things went 
 *  */
async function applicationSubmission(req,res){
    try{
        const dto = new ApplicationDTO(req.body)
        const application = new Application(dto)

        //added this to force the user id of the dto to be the id of the auth cookie
        //to prevent identity hijacking, added to the other functions on this page too.
        if(dto.person_id !== req.user.person_id){
            return res.status(403).json({
                ok: false,
                error: "provided user id does not belong to the cookie owner"
            })
        }

        if(
            dto.competenceProfile.length === 0  || 
            dto.availability.length === 0 
            ){
                return res.status(400).json({
                    success:false,
                    error:"All fields must be filled"
                })
        }

        const result = await application.applicationSubmission(dto)

        if(!result.success){
            return res.status(400).json({
                success: false,
                error: result.error || "Application submission failed"
            })
        }
        
        return res.status(200).json(result);
    }catch(err){
        console.error("APPLICATION SUBMISSION ERROR: ", err)
        return res.status(500).json({success: false, error: "Server Error"})
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
                success: false,
                error: "no person_id provided"
            })
        }
        //same identity hijacking check as earlier. compare cookie identity (req.user.person_id) to 
        //purported identity (person_id).
        if(Number(person_id) !== req.user.person_id){
            return res.status(403).json({
                ok: false,
                error: "provided user id does not belong to the cookie owner"
            })
        }
        const application = new Application({})
        const result = await application.getApplication({person_id})

        if(!result.success){
            return res.status(404).json({
                success: false,
                error: "Application not found"
            })
        }

        return res.status(200).json(result)
    }catch(error){
        console.error("ERROR: ", error)
        return res.status(500).json({
            success: false,
            error: "server error"
        })
    }
}

 async function updatePI(req, res) {
    try{
        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: "INVALID_INPUT"
            })
        }

        const { firstName, lastName, email, personalNumber } = req.body

        //same identity hijacking check as earlier. compare cookie identity (req.user.person_id) to 
        //purported identity (dto.person_id).
        if(dto.person_id !== req.user.person_id){
            return res.status(403).json({
                ok: false,
                error: "provided user id does not belong to the cookie owner"
            })
        }

        if (!firstName || typeof firstName !== "string" ||
            !lastName || typeof lastName !== "string" ||
            !email || typeof email !== "string" ||
            !personalNumber || typeof personalNumber !== "string") {

            return res.status(400).json({
                success: false,
                error: "INVALID_INPUT"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "INVALID_EMAIL"
            })
        }


        const dto = new UserDTO(req.body)
        
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
            success: false,
            error: "server error"
        })
    }
    
 }



 module.exports = {
    applicationSubmission, 
    fetchApplication,
    updatePI
};