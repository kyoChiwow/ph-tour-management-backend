/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";

passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done : VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;

            if (!email) {
                return done(null, false, { message: "Email not found" });
            }

            let user = await User.findOne({ email });
            if(!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id,
                        }
                    ]
                })
            }

            return done(null, user, { message: "User created successfully!" });

        } catch (error) {
            console.log("Google strategy error", error);
            return done(error);
        }
    }) // This is where you communicate with DB and create or update user
)

// Flow of google authetication =>
// frontend_url(localhost:5173) --> backend_url(localhost:5000/api/v1/auth/google/callback) --> passport --> Google Oauth Consent -->  gmail login --> successfull --> Callback_url(localhost:5000/api/v1/auth/google/callback) --> Bridge

// Bridge => 
// Google login --> user DB store(check if it exists if not create) --> token

// Basic Understanding =>
// Customer --> email, password, role : User, name ... --> registration --> DB --> 1 created User
// Goole --> req --> google --> successfull : Jwt Token: Role, email, etc.. --> DB --> Stored in DB --> token --> APi Access

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error)
        done(error);
    }
})