import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default (yamlPath: string) => {
  return () => {
    const config = yaml.load(
      readFileSync(join(__dirname, yamlPath), 'utf-8'),
    ) as Record<string, any>;
    // console.log(config);
    return config;
  };
};
