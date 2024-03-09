import passport from 'passport'
import express from 'express';
const CLIENT_URL = "http://linkjob-grouciyacine.vercel.app/";
const app = express();
app.get("/login/success", (req, res) => {
    console.log(req?.user)
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            //   cookies: req.cookies
        });
    }else {
        console.log("User is not authenticated");
        res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
});

app.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});
app.get("/github", passport.authenticate("github", { scope: ["profile"] }));

app.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

app.get("/linkedin", passport.authenticate("linkedin", { }));

app.get(
    "/linkedin/callback",
    passport.authenticate("linkedin", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);
app.get("/google", passport.authenticate("google", { scope: ["profile"] }));

app.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);

export default app