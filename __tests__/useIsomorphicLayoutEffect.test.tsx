import { render } from '@testing-library/react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

function Probe({ onRun }: { onRun: () => void }) {
  useIsomorphicLayoutEffect(() => {
    onRun();
  }, []);
  return null;
}

describe('useIsomorphicLayoutEffect', () => {
  it('runs the effect exactly once on mount in a DOM (jsdom) environment', () => {
    const onRun = jest.fn();
    render(<Probe onRun={onRun} />);
    expect(onRun).toHaveBeenCalledTimes(1);
  });
});
