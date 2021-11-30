import type {Config} from '@jest/types';
import BaseConfig from '../../jest.config';

const config: Config.InitialOptions = {
    ...BaseConfig,
    rootDir: "./"
}
export default config;
