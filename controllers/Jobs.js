import Companny from "../models/Companny.js";
import Jobs from "../models/Jobs.js";
export const CreateCompany = async (req, res, next) => {
    try {
        const { name } = req.body;
        const checkCompany=await Companny.findOne({name:name})
        console.log(checkCompany,typeof(name))
        if (checkCompany) {
            return res.status(200).json(checkCompany)
        } else {
            const newCompany =  new Companny({ ...req.body, userId: req.user.id });
            newCompany.save();
            res.status(200).json(newCompany);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export const getCompany = async (req, res, next) => {
    try {
        const getCompany = await Companny.findById(req.params.id);
        if (!getCompany) {
            throw new Error("Company not found");
        }
        return res.status(200).json(getCompany);
    } catch (err) {
        next(err);
    }
};
export const getMyCompany=async(req, res, next) => {
    try{
        const getAllCompany = await Companny.find({userId:req.user.id});
        if(!getAllCompany){
            throw new Error("No Company  found");
        }
        return res.status(200).json(getAllCompany)
    }catch(err){
        next(err);
    }
}
export const addJob = async (req, res, next) => {
    try {
        const newJob = new Jobs({ ...req.body });
        newJob.save();
        return res.status(200).json(newJob);
    } catch (e) {
        console.log(e);
        next(e);
    }
};
export const getJob = async (req, res, next) => {
    try {
        const getJob = await Jobs.findById(req.params.id);
        if (!getJob) {
            throw new Error("Company not found");
        }
        return res.status(200).json(getJob);
    } catch (err) {
        next(err);
    }
};
export const SearchJobs = async (req, res, next) => {
    try {
        const job = await Jobs.find({ title: { $regex: req.query.title, $options: 'i' }, });
        const companyIds = job.map((job) => job.CompanyID)
        const company = await Companny.find({ _id: { $in: companyIds } })
        if (!job) {
            return res.status(200).json("No Job found");
        }
        // Create a map of companies using their IDs for efficient lookup
        const companyMap = {};
        company.forEach((company) => {
            companyMap[company._id.toString()] = company;
        });

        // Map job data with company descriptions
        const jobsWithCompanyDescriptions = job.map((job) => ({
            job: job.toObject(), // Convert the Mongoose document to a plain object
            company: companyMap[job.CompanyID] ? companyMap[job.CompanyID].toObject() : null,
        }));
        console.log(job)
        return res.status(200).json(jobsWithCompanyDescriptions);
    } catch (err) {
        next(err);
    }
};

export const checkboxes = async (req, res, next) => {
    try {
        const type = req.body.type;
        const level = req.body.level;
        const work = req.body.culture;
        const salary = req.body.salary;
        const andConditions = [];
        // Add conditions for non-empty arrays
        if (type?.length > 0) {
            andConditions.push({ type: { $in: type } });
        }
        if (level?.length > 0) {
            andConditions.push({ level: { $in: level } });
        }
        if (work?.length > 0) {
            andConditions.push({ culture: { $in: work } });
        }
        if (salary?.length > 0) {
            andConditions.push({ salary: { $in: salary } });
        }
        console.log(andConditions)
        const query = { $and: andConditions };
        const jobs = await Jobs.find(query)
        const companyIds = await jobs.map((job) => job.CompanyID)
        const company = await Companny.find({ _id: { $in: companyIds } })
        const companyMap = {}
        company.forEach((company) => {
            companyMap[company._id.toString()] = company
        })
        const JobWithCompanyDescription = jobs.map((job) => ({
            job: job.toObject(),
            company: companyMap[job.CompanyID] ? companyMap[job.CompanyID].toObject() : null
        }))
        return res.status(200).json(JobWithCompanyDescription)
    } catch (err) {
        next(err);
    }
}