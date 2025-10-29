import { describe, expect, it } from 'vitest';
import { deepFreeze } from '../deepFreeze';

describe('deepFreeze function', () => {
  it('should create a deep freeze of an object', () => {
    const original = { a: 1, b: { c: 2 } };

    const frozen = deepFreeze(original);

    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.b)).toBe(true);
  });

  it('should not allow modifications to the frozen object', () => {
    const original = { a: 1, b: { c: 2 } };

    const frozen = deepFreeze(original);

    expect(() => {
      frozen.b.c = 20;
    }).toThrow();
  });

  it('should return the same object reference', () => {
    const original = { a: 1, b: { c: 2 } };

    const frozen = deepFreeze(original);

    expect(frozen).toBe(original);
  });
});
