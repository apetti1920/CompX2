import type {Config} from '@jest/types';
import BaseConfig from '../../jest.config';

const config: Config.InitialOptions = {
    ...BaseConfig,
    rootDir: "./",
    collectCoverageFrom: ['src/**/*.ts'],
    coverageReporters: ["json", "html"],
    coverageDirectory: "<rootDir>/__tests__/coverage"
}
export default config;
