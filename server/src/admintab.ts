import * as fs from 'fs-extra';
import * as path from 'path';
import * as express from 'express';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as sh from 'shelljs';
import * as slug from 'slugg';
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

app.get('/api/content/*', async (req: express.Request, res: express.Response) => {
	const pathname = req.params[0];
	const items = await sh.ls('-l', path.join(userDir, 'content', pathname));
	if (items.length === 1 && pathname.endsWith('.json')) {
		res.sendFile(items[0]['name']);
	} else {
		res.send({
			type: 'Folder',
			content: items.map(item => item['name']),
		});
	}
});

app.post('/api/content/*', async (req: express.Request, res: express.Response) => {
	const pathname = req.params[0];
	if (pathname.endsWith('.json')) {
		// file
		const { file } = req.body;
		await fs.outputJson(path.join(userDir, 'content', pathname), file);
	} else {
		// folder
		await sh.mkdir('-p', path.join(userDir, 'content', pathname));
	}
	res.send({ pathname });
});

app.get('/api/types', async (req: express.Request, res: express.Response) => {
	const items = await sh.ls('-l', path.join(userDir, 'types'));
	res.send(items.map(item => item['name'].split('.json')[0]));
});

app.get('/api/types/:type', (req: express.Request, res: express.Response) => {
	const { type } = req.params;
	res.sendFile(path.join(userDir, 'types', `${type}.json`));
});

app.post('/api/mv', async (req: express.Request, res: express.Response) => {
	const { source, target } = req.body;
	await sh.mkdir('mv', path.join(userDir, 'content', source), path.join(userDir, 'content', target));
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
