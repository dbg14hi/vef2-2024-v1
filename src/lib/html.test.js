import { describe, expect, it } from '@jest/globals';
import { template } from './html.js';

describe('html', () => {
  describe('template', () => {
    it('should return template with given title and body', () => {
      const result = template('title', 'body');

      expect(result).toContain('<title>title</title>');
    });
  });
});
