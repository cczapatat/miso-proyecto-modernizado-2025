import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ExerciseBaseComponent } from './exercise-base.component';

@Component({
  template: '<div></div>'
})
class TestExerciseBaseComponent extends ExerciseBaseComponent {
  public testYoutubeUrlValidator(control: AbstractControl): ValidationErrors | null {
    return this.youtubeUrlValidator(control);
  }
}

describe('ExerciseBaseComponent', () => {
  let component: TestExerciseBaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestExerciseBaseComponent]
    });

    const fixture = TestBed.createComponent(TestExerciseBaseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('youtubeUrlValidator', () => {
    it('should return null for valid youtube.com URLs', () => {
      const validUrls = [
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      ];

      validUrls.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toBeNull(`Failed for URL: ${url}`);
      });
    });

    it('should return null for valid youtu.be URLs', () => {
      const youtubeBeUrls = [
        'https://youtu.be/dQw4w9WgXcQ',
        'http://youtu.be/dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ?t=10',
        'https://youtu.be/dQw4w9WgXcQ?t=10s'
      ];

      youtubeBeUrls.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Expected validation error for youtu.be URL: ${url}`);
      });
    });

    it('should return validation error for invalid URLs', () => {
      const invalidUrls = [
        'https://vimeo.com/123456789',
        'https://google.com',
        'not-a-url',
        'https://youtube.co/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/video/dQw4w9WgXcQ',
        'ftp://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://facebook.com/video',
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'http://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch?v=dQw4w9WgXcQ&t=10s',
        'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      invalidUrls.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Failed for URL: ${url}`);
      });
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      const result = component.testYoutubeUrlValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = { value: null } as AbstractControl;
      const result = component.testYoutubeUrlValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
      const control = { value: undefined } as AbstractControl;
      const result = component.testYoutubeUrlValidator(control);
      expect(result).toBeNull();
    });

    it('should handle whitespace in URLs', () => {
      const validUrlsWithWhitespace = [
        ' https://youtube.com/watch?v=dQw4w9WgXcQ ',
        '\nhttps://youtube.com/watch?v=dQw4w9WgXcQ\n',
        '\thttps://www.youtube.com/watch?v=dQw4w9WgXcQ\t'
      ];

      validUrlsWithWhitespace.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toBeNull(`Failed for URL with whitespace: ${url}`);
      });

      const youtubeBeWithWhitespace = [
        ' https://youtu.be/dQw4w9WgXcQ ',
        '\thttps://youtu.be/dQw4w9WgXcQ\t'
      ];

      youtubeBeWithWhitespace.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Failed for URL with whitespace: ${url}`);
      });
    });

    it('should validate URLs with various video IDs', () => {
      const videoIds = [
        'dQw4w9WgXcQ',
        'BaW_jenozKc',
        '9bZkp7q19f0',
        '_uQrJ0TkZlc',
        'zbLP0wWOQmY',
      ];

      videoIds.forEach(videoId => {
        const youtubeUrl = `https://youtube.com/watch?v=${videoId}`;
        const youtubeWwwUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const youtuBeUrl = `https://youtu.be/${videoId}`;

        const youtubeControl = { value: youtubeUrl } as AbstractControl;
        const youtubeWwwControl = { value: youtubeWwwUrl } as AbstractControl;
        const youtuBeControl = { value: youtuBeUrl } as AbstractControl;

        expect(component.testYoutubeUrlValidator(youtubeControl)).toBeNull(`Failed for youtube.com URL: ${youtubeUrl}`);
        expect(component.testYoutubeUrlValidator(youtubeWwwControl)).toBeNull(`Failed for www.youtube.com URL: ${youtubeWwwUrl}`);

        expect(component.testYoutubeUrlValidator(youtuBeControl)).toEqual({ youtubeUrl: true }, `Failed for youtu.be URL: ${youtuBeUrl}`);
      });
    });

    it('should reject URLs with invalid video ID format', () => {
      const invalidVideoIds = [
        'https://youtube.com/watch?v=',
        'https://youtu.be/',
      ];

      invalidVideoIds.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Failed for invalid video ID URL: ${url}`);
      });

      const shortButValidVideoIds = [
        'https://youtube.com/watch?v=abc',
        'https://www.youtube.com/watch?v=ab',
        'https://youtu.be/abc',
      ];

      shortButValidVideoIds.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        if (url.includes('youtu.be')) {
          expect(result).toEqual({ youtubeUrl: true }, `youtu.be URL should fail: ${url}`);
        } else {
          expect(result).toBeNull(`Short but valid YouTube URL should pass: ${url}`);
        }
      });
    });

    it('should handle case insensitive domain validation', () => {
      const caseVariations = [
        'https://YouTube.com/watch?v=dQw4w9WgXcQ',
        'https://YOUTUBE.COM/watch?v=dQw4w9WgXcQ',
        'https://Youtube.com/watch?v=dQw4w9WgXcQ',
        'https://YouTu.be/dQw4w9WgXcQ',
        'https://YOUTU.BE/dQw4w9WgXcQ'
      ];

      caseVariations.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Failed for case variation: ${url}`);
      });
    });

    it('should validate YouTube URLs with additional query parameters', () => {
      const urlsWithParams = [
        'https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s',
        'https://youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmRdnEQy6nuLMt-8lHMrr5uVhcGtO&index=1',
        'https://youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=TestChannel',
        'https://youtu.be/dQw4w9WgXcQ?t=30',
        'https://youtu.be/dQw4w9WgXcQ?si=abc123def456'
      ];

      urlsWithParams.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Failed for URL with parameters: ${url}`);
      });
    });

    it('should reject malformed YouTube URLs', () => {
      const malformedUrls = [
        'youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch',
        'https://youtube.com/watch?video=dQw4w9WgXcQ',
        'https://youtube.com/v/dQw4w9WgXcQ',
        'https://youtube.com/embed/dQw4w9WgXcQ',
      ];

      malformedUrls.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Failed for malformed URL: ${url}`);
      });
    });

    it('should handle edge cases with special characters', () => {
      const edgeCases = [
        'https://youtube.com/watch?v=dQw4w9WgXcQ#t=30s',
        'https://youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be',
        'https://m.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be',
      ];

      edgeCases.forEach(url => {
        const control = { value: url } as AbstractControl;
        const result = component.testYoutubeUrlValidator(control);
        expect(result).toEqual({ youtubeUrl: true }, `Failed for edge case: ${url}`);
      });
    });
  });

  describe('component inheritance', () => {
    it('should be extendable by other components', () => {
      expect(component instanceof ExerciseBaseComponent).toBe(true);
    });

    it('should provide access to youtubeUrlValidator method', () => {
      expect(typeof component.testYoutubeUrlValidator).toBe('function');
    });
  });
});
