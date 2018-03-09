import * as express from 'express';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import { createJwtMiddleware, createJwtToken } from './jwt';
import { config } from './config';

console.log(`+++ ${config.env} +++`, );
// console.log('token', createJwtToken({}));

const app = express();
// app.use(express.static(path.join(process.cwd(), 'public')));
app.use(passport.initialize());
app.use(bodyParser.json());

const jwtMiddleware = createJwtMiddleware();

app.get('/api/echo', jwtMiddleware, (req: express.Request, res: express.Response) => {
	console.log('req.user', req['user']); // contains the jwtPayload
	res.send(req.query);
});

app.post('/api/echo', jwtMiddleware, (req: express.Request, res: express.Response) => {
	console.log('req.user', req['user']); // contains the jwtPayload
	res.send(req.body);
});

const server = app.listen(config.port, () => {
	console.log(`Listening on http://localhost:${config.port}`);
});

const _server = require('http-shutdown')(server);

function shutdown() {
	_server.shutdown(() => {
		console.log('Bye!');
		process.exit(0);
	});

	function onTimeout() {
		console.log('Timeout while shutting down! Forcing termination...');
		process.exit(1);
	}

	setTimeout(onTimeout, 5000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
