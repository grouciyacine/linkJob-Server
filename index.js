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
const app = express();
const configCors = {
    origin: "*",
    credential: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}
app.options("", cors(configCors))
/*app.use(
    CookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);*/
app.use(
    CookieSession({
        name: "session",
        keys: ["lama"],
        maxAge: 24 * 60 * 60 * 1000, // Adjusted maxAge value (in milliseconds)
        secure: true, // Ensures cookies are only sent over HTTPS
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        sameSite: 'none' ,// Allows cross-site requests
        
    })
);
app.use(passport.initialize())
app.use(passport.session())



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
//app.use(cors({ origin: 'https://linkjob-grouciyacine.vercel.app', credentials: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://linkjob-grouciyacine.vercel.app');//https://linkjob-grouciyacine.vercel.app
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    //res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

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