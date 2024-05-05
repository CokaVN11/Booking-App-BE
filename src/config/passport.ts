import { Strategy as LocalStrategy } from "passport-local";
import { AccountService } from "@services";
import { PassportStatic } from "passport";

const passportConfig = (passport: PassportStatic) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const isBio = req.query.isBio === "true";
          const user = await AccountService.getInstance().getAccountByUsername(username);
          let isPasswordValid = false;

          if (!user) {
            return done(null, false, {
              message: "Invalid username or password.",
            });
          }

          if (isBio) {
            isPasswordValid = await AccountService.getInstance().comparePassword(password, user.password);
          } else {
            isPasswordValid = await AccountService.getInstance().comparePasswordWithHash(password, user.password);
          }

          if (!isPasswordValid) {
            return done(null, false, {
              message: "Invalid username or password.",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.username);
  });

  passport.deserializeUser(async (username: string, done) => {
    try {
      const user = await AccountService.getInstance().getAccountByUsername(username);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default passportConfig;