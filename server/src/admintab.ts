import * as path from 'path';
import * as express from 'express';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as sh from 'shelljs';
import { createJwtMiddleware, createJwtToken } from './jwt';
import { config } from './config';

console.log(`+++ ${config.env} +++`, );
// console.log('token', createJwtToken({}));

const app = express();
const userDir = path.join(process.cwd(), config.userDir);
// app.use(express.static(userDir));
app.use(passport.initialize());
app.use(bodyParser.json());

const jwtMiddleware = createJwtMiddleware();

app.get('/content/*', async (req: express.Request, res: express.Response) => {
	const _path = req.params[0];
	const items = await sh.ls('-l', path.join(userDir, 'content', _path));
	if (items.length === 1 && items[0]['name'].endsWith('.json')) {
		res.sendFile(items[0]['name']);
	} else {
		res.send(items.map(item => item['name']));
	}
});

app.get('/types/:type', (req: express.Request, res: express.Response) => {
	const { type } = req.params;
	res.sendFile(path.join(userDir, 'types', `${type}.json`));
});

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
