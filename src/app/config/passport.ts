import bcryptjs from "bcryptjs";
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        // if (!isUserExist) {
        //   return done(null, false, { message: "User does not exist" });
        // }

        if (!isUserExist) {
            return done("User does not exist");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through google login, if you want to login with credentials, then please set your password first!",
          });
        }

        // if (isGoogleAuthenticated) {
        //     return done("You have authenticated through google login, if you want to login with credentials, then please set your password first!");
        // }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match!" });
        }

        return done(null, isUserExist);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        done(error);
      }
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
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
              },
            ],
          });
        }

        return done(null, user, { message: "User created successfully!" });
      } catch (error) {
        console.log("Google strategy error", error);
        return done(error);
      }
    }
  ) // This is where you communicate with DB and create or update user
);

// Flow of google authetication =>
// frontend_url(localhost:5173) --> backend_url(localhost:5000/api/v1/auth/google/callback) --> passport --> Google Oauth Consent -->  gmail login --> successfull --> Callback_url(localhost:5000/api/v1/auth/google/callback) --> Bridge

// Bridge =>
// Google login --> user DB store(check if it exists if not create) --> token

// Basic Understanding =>
// Customer --> email, password, role : User, name ... --> registration --> DB --> 1 created User
// Goole --> req --> google --> successfull : Jwt Token: Role, email, etc.. --> DB --> Stored in DB --> token --> APi Access

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
