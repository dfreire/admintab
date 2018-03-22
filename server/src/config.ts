import * as path from 'path';

export interface Config {
    env: 'development' | 'production';
    port: number;
    jwtSecret: string;
    userDir: string;
}

const { NODE_ENV } = process.env;
if (NODE_ENV == null) {
    console.error('Error: The NODE_ENV enviroment variable is not defined!');
    process.exit(1);
}

const configPath = path.join(process.cwd(), 'config', `${NODE_ENV}.json`);
let config: Config;
try {
    config = require(configPath);
} catch (err) {
    const relativePath = path.relative(process.cwd(), configPath);
    console.error(`Error: Could not load the configuration file: '${relativePath}'!`);
    process.exit(1);
}

export { config };
