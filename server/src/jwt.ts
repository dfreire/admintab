import * as passport from 'passport';
import * as passportJwt from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { config } from './config';

export type JwtPayload = object;

export function createJwtMiddleware() {
	const strategyOptions = {
		secretOrKey: config.jwtSecret,
		jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('JWT'),
	};

	function strategyCallback(jwtPayload: JwtPayload, done: any) {
		done(null, jwtPayload);
	}

	passport.use(new passportJwt.Strategy(strategyOptions, strategyCallback));

	return passport.authenticate('jwt', { session: false });
}

export function createJwtToken(jwtPayload: JwtPayload): string {
	return jwt.sign(jwtPayload, config.jwtSecret, {
		// expiresIn: config.loginJwtExpires
	});
}

export function verifyJwtToken(token: string): JwtPayload | undefined {
	try {
		return jwt.verify(token, config.jwtSecret) as JwtPayload;
	} catch (err) {
		return undefined;
	}
}
