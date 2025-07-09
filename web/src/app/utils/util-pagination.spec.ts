import { UtilPagination } from './util-pagination';

describe('UtilPagination', () => {
  describe('getPages', () => {
    it('should return an array with only current page when there is only one page', () => {
      const result = UtilPagination.getPages(1, 1);
      expect(result).toEqual([1]);
    });

    it('should return array [1, 2, 3] when current is 1 and total is 3', () => {
      const result = UtilPagination.getPages(1, 3);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return array [1, 2, 3, 4, 5] when current is 3 and total is 5', () => {
      const result = UtilPagination.getPages(3, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should include ellipsis and last page when total pages exceed visible range', () => {
      const result = UtilPagination.getPages(1, 10);
      expect(result).toContain(1);
      expect(result).toContain('...');
      expect(result).toContain(10);
    });

    it('should include first page and ellipsis when current page is near the end', () => {
      const result = UtilPagination.getPages(9, 10);
      expect(result).toContain(1);
      expect(result).toContain('...');
      expect(result).toContain(9);
      expect(result).toContain(10);
    });

    it('should handle middle pages correctly with ellipsis on both sides', () => {
      const result = UtilPagination.getPages(5, 10);
      expect(result).toContain(1);
      expect(result).toContain('...');
      expect(result).toContain(5);
      expect(result).toContain('...');
      expect(result).toContain(10);
    });

    it('should return correct range when current page is 2 and total is 10', () => {
      const result = UtilPagination.getPages(2, 10);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
      expect(result).toContain('...');
      expect(result).toContain(10);
    });

    it('should return correct range when current page is last page', () => {
      const result = UtilPagination.getPages(10, 10);
      expect(result).toContain(1);
      expect(result).toContain('...');
      expect(result).toContain(8);
      expect(result).toContain(9);
      expect(result).toContain(10);
    });

    it('should handle edge case when current is 0', () => {
      const result = UtilPagination.getPages(0, 5);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain(1);
      expect(result).toContain(5);
    });

    it('should handle edge case when total is 0', () => {
      const result = UtilPagination.getPages(1, 0);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBe(1);
    });

    it('should handle edge case when current is greater than total', () => {
      const result = UtilPagination.getPages(5, 3);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(3);
    });

    it('should return all pages when total is less than or equal to 5', () => {
      const result = UtilPagination.getPages(2, 4);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should work correctly with exactly 6 pages', () => {
      const result = UtilPagination.getPages(3, 6);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should work correctly with exactly 7 pages, current at beginning', () => {
      const result = UtilPagination.getPages(2, 7);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
      expect(result).toContain('...');
      expect(result).toContain(7);
    });

    it('should work correctly with exactly 7 pages, current at end', () => {
      const result = UtilPagination.getPages(6, 7);
      expect(result).toContain(1);
      expect(result).toContain('...');
      expect(result).toContain(5);
      expect(result).toContain(6);
      expect(result).toContain(7);
    });
  });
});
