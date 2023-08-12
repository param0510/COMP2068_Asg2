// This file stores all the system related info
configurations = {
    db: "mongodb+srv://admin:password2023S@cluster0.nspbzep.mongodb.net/xStore", // database connection string
    oauth: {
        github: {
            clientID: "Iv1.0d767e4c5fad6deb",
            clientSecret: "c8779757db1b9f0270f929797e5bd992bb83ad18",
            callbackUrl: "https://xstore-s2023.onrender.com/github/callback" // local version: "http://localhost:3000/github/callback" - just make sure to change this during to deployment to production server. Go to github dev settings where the app is registered.
        }
    }
}

module.exports = configurations