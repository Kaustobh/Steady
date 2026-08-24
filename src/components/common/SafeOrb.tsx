import { Component, type ReactNode } from 'react';
import { ThinkingOrb } from 'thinking-orbs';
import { Sparkles } from 'lucide-react';

interface SafeOrbProps {
  state: 'working' | 'searching' | 'solving' | 'listening' | 'connecting' | 'weaving' | 'composing' | 'breathing' | 'shaping';
  size?: any;
  theme?: 'auto' | 'dark' | 'light';
}

interface SafeOrbState {
  hasError: boolean;
}

/**
 * SafeOrb Component
 * Error boundary wrapper around thinking-orbs canvas component.
 * Fallbacks to SVG particle orb if WebGL/Canvas fails on certain devices/deployments.
 */
export class SafeOrb extends Component<SafeOrbProps, SafeOrbState> {
  constructor(props: SafeOrbProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('ThinkingOrb canvas error caught by SafeOrb fallback:', error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: `${this.props.size || 24}px`,
            height: `${this.props.size || 24}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
          }}
        >
          <Sparkles size={Math.max(12, (Number(this.props.size) || 24) * 0.5)} />
        </div>
      );
    }

    try {
      return <ThinkingOrb state={this.props.state} size={this.props.size} theme={this.props.theme} />;
    } catch {
      return (
        <div
          style={{
            width: `${this.props.size || 24}px`,
            height: `${this.props.size || 24}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
          }}
        >
          <Sparkles size={Math.max(12, (Number(this.props.size) || 24) * 0.5)} />
        </div>
      );
    }
  }
}
