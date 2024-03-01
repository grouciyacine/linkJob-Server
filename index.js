import express from 'express';
import connect from './connect.js';
import dotenv from 'dotenv';
import UserAuth from './routes/User.js'
import JobsRouter from './routes/Jobs.js'
import multer from 'multer';
import cors from 'cors'
import passport from './passport/google.js'
import PassportRoute from './routes/Passport.js'
import CookieSession from 'cookie-session'

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    return await fn(req, res);
};
const app = express();
app.use(
    CookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize())
app.use(passport.session())




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder where uploaded files will be stored
        cb(null, "../client/public/uploads");
    },
    filename: function (req, file, cb) {
        // Set the filename for the uploaded file
        const fileName = Date.now() + "-" + file.originalname.replace(/\s+/g, '-');
        cb(null, fileName);
    },
});
const upload = multer({ storage: storage });
app.use(express.json());
dotenv.config()
app.post("/api/v1/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const filename = req.file.filename;
    const filePath = req.file.path;
    res.status(200).json({ message: "File uploaded successfully", filename, filePath });

});
app.use(allowCors);

app.use('/api/v1/user', UserAuth);
app.use('/api/v1/jobs', JobsRouter);
app.use('/auth', PassportRoute)
const databaseConnect = async () => {
    try {
        await connect(process.env.MONGOOSE)
        app.listen(5000, () => console.log('port listening on port 5000'))
    } catch (e) {
        console.log(e)
    }

}
databaseConnect()