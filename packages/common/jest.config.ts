import type {Config} from '@jest/types';
import BaseConfig from '../../jest.config';

const config: Config.InitialOptions = {
    ...BaseConfig,
    rootDir: "./",
    collectCoverageFrom: ['src/**/*.ts']
}
export default config;
