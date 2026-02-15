const ApplicationDTO = require("../domain/ApplicationDTO");
const { Application } = require("../services/applicationService");

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
        if(!result){
            return res.status(401).json({
                ok: false,
                error: "All fields must be filled"
            })
        }
        
        return res.status(200).json({ ok: true, message: "Application submitted!" });
    }catch(err){
        console.error("APPLICATION SUBMISSION ERROR: ", err)
        return res.status(500).json({ok: false, error: "Server Error"})
    }
}




 module.exports = {
    applicationSubmission, 
};