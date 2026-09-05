import { describe, expect, it } from 'vitest';
import { configurePlugin } from '../configurePlugin';
import { withOptionsPlugin } from '../../utils/tests';

describe('configurePlugin', () => {
  it('should return an object with the plugin and options', () => {
    const options = {
      option1: 'value1',
      option2: 100,
    };

    const configured = configurePlugin(withOptionsPlugin, options);

    expect(configured).toEqual({
      plugin: withOptionsPlugin,
      options,
    });
  });
});
