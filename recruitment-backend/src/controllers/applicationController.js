const ApplicationDTO = require("./ApplicationDTO");
const { Application } = require("./Application");

async function applicationSubmission(req,res){
    try{
        const dto = new ApplicationDTO(req.body)
        const application = new Application(dto)

        if(typeof dto.personalInfo !== "string" || 
            typeof dto.competenceProfile !== "string" || 
            typeof dto.availability !== "string"){
                return res.status(400).json({
                    ok:false,
                    error:"All fields must be filled"
                })
        }

        const result = await applicationnService.applicationSubmission(dto)
        if(!result){
            return res.status(401).json({
                ok: false,
                error: "All fields must be filles"
            })
        }

    }catch(err){
        console.error("APPLICATION SUBMISSION ERROR: ", err)
        return res.status(500).json({ok: false, error: "Server Error"})
    }
}

