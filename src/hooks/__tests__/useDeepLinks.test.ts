import { renderHook } from '@testing-library/react';
import { useDeepLinks, DeepLinkKey } from '../useDeepLinks';

describe('useDeepLinks', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('hrefFor', () => {
    it('generates correct href for EXPLORE', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('EXPLORE');
      expect(href).toBe('/explore?tab=activities');
    });

    it('generates correct href for FAVES', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('FAVES');
      expect(href).toBe('/favorites?tab=saved');
    });

    it('generates correct href for MESSAGES', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('MESSAGES');
      expect(href).toBe('/chat');
    });

    it('generates correct href for DAY_TRIPS', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('DAY_TRIPS');
      expect(href).toBe('/explore?tab=daytrips');
    });

    it('generates correct href for ESIM', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('ESIM');
      expect(href).toBe('/essentials?section=esim');
    });

    it('generates correct href for RESTAURANTS', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('RESTAURANTS');
      expect(href).toBe('/explore?tab=restaurants');
    });

    it('returns # and warns for unknown key', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('UNKNOWN' as DeepLinkKey);
      
      expect(href).toBe('#');
      expect(consoleSpy).toHaveBeenCalledWith('No deep link configuration found for key: UNKNOWN');
    });

    it('handles empty query params correctly', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('MESSAGES');
      expect(href).toBe('/chat');
    });

    it('properly encodes query parameters', () => {
      const { result } = renderHook(() => useDeepLinks());
      const href = result.current.hrefFor('EXPLORE');
      expect(href).toBe('/explore?tab=activities');
    });
  });

  describe('navigate', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('navigates to EXPLORE with correct path', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('EXPLORE');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /explore?tab=activities');
    });

    it('navigates to FAVES with correct path', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('FAVES');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /favorites?tab=saved');
    });

    it('navigates to MESSAGES with correct path', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('MESSAGES');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /chat');
    });

    it('navigates to DAY_TRIPS with correct path', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('DAY_TRIPS');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /explore?tab=daytrips');
    });

    it('navigates to ESIM with correct path', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('ESIM');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /essentials?section=esim');
    });

    it('navigates to RESTAURANTS with correct path', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('RESTAURANTS');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /explore?tab=restaurants');
    });

    it('merges extra query parameters', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('EXPLORE', { category: 'outdoor', difficulty: 'easy' });
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /explore?tab=activities&category=outdoor&difficulty=easy');
    });

    it('overwrites default params with extra params', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('EXPLORE', { tab: 'museums' });
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /explore?tab=museums');
    });

    it('handles empty extra params object', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('EXPLORE', {});
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /explore?tab=activities');
    });

    it('warns and does not navigate for unknown key', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('UNKNOWN' as DeepLinkKey);
      
      expect(consoleSpy).toHaveBeenCalledWith('No deep link configuration found for key: UNKNOWN');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('properly encodes special characters in extra params', () => {
      const { result } = renderHook(() => useDeepLinks());
      result.current.navigate('EXPLORE', { search: 'café & restaurant' });
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /explore?tab=activities&search=caf%C3%A9%20%26%20restaurant');
    });
  });

  describe('hook stability', () => {
    it('returns stable function references', () => {
      const { result, rerender } = renderHook(() => useDeepLinks());
      
      const firstHrefFor = result.current.hrefFor;
      const firstNavigate = result.current.navigate;
      
      rerender();
      
      expect(result.current.hrefFor).toBe(firstHrefFor);
      expect(result.current.navigate).toBe(firstNavigate);
    });
  });

  describe('all deep link keys', () => {
    const allKeys: DeepLinkKey[] = ['EXPLORE', 'FAVES', 'MESSAGES', 'DAY_TRIPS', 'ESIM', 'RESTAURANTS'];

    it('generates valid hrefs for all keys', () => {
      const { result } = renderHook(() => useDeepLinks());
      
      allKeys.forEach(key => {
        const href = result.current.hrefFor(key);
        expect(href).toMatch(/^\/[\w-]+(\?.*)?$/);
        expect(href).not.toBe('#');
      });
    });

    it('navigates successfully for all keys', () => {
      const { result } = renderHook(() => useDeepLinks());
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      allKeys.forEach(key => {
        result.current.navigate(key);
      });
      
      expect(consoleLogSpy).toHaveBeenCalledTimes(6);
      consoleLogSpy.mockRestore();
    });
  });
});