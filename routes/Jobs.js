import {CreateCompany, SearchJobs, addJob, checkboxes, getCompany,getMyCompany, getJob} from '../controllers/Jobs.js';
import express from 'express';
import verify from '../verify.js';
const app=express();
app.post('/addCompany',verify,CreateCompany);
app.get('/getCompany/:id',getCompany);
app.post('/addJob',addJob);
app.get('/getJob/:id',getJob);
app.post('/SearchJob',SearchJobs);
app.post('/checkbox',checkboxes)
app.get('/getAllCompany',verify,getMyCompany)
export default app;