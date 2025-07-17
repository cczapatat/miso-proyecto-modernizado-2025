import { FormControl } from '@angular/forms';
import { positiveNumberValidator } from './positive-number.validator';

describe('PositiveNumberValidator', () => {
  it('should return null for positive numbers', () => {
    const control = new FormControl(5);
    const result = positiveNumberValidator(control);
    expect(result).toBeNull();
  });

  it('should return error for zero', () => {
    const control = new FormControl(0);
    const result = positiveNumberValidator(control);
    expect(result).toEqual({ positiveNumber: true });
  });

  it('should return error for negative numbers', () => {
    const control = new FormControl(-1);
    const result = positiveNumberValidator(control);
    expect(result).toEqual({ positiveNumber: true });
  });

  it('should return null for null values', () => {
    const control = new FormControl(null);
    const result = positiveNumberValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for undefined values', () => {
    const control = new FormControl(undefined);
    const result = positiveNumberValidator(control);
    expect(result).toBeNull();
  });

  it('should return error for empty string (truthy but evaluates to 0)', () => {
    const control = new FormControl('');
    const result = positiveNumberValidator(control);
    expect(result).toEqual({ positiveNumber: true });
  });

  it('should return error for zero string', () => {
    const control = new FormControl('0');
    const result = positiveNumberValidator(control);
    expect(result).toEqual({ positiveNumber: true });
  });

  it('should return null for positive decimal numbers', () => {
    const control = new FormControl(1.5);
    const result = positiveNumberValidator(control);
    expect(result).toBeNull();
  });

  it('should return error for negative decimal numbers', () => {
    const control = new FormControl(-0.5);
    const result = positiveNumberValidator(control);
    expect(result).toEqual({ positiveNumber: true });
  });
});
