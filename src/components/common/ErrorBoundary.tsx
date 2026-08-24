import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Steady app:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#EAEFF5',
            color: '#2D343C',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '380px',
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: '#EAEFF5',
              boxShadow: '6px 6px 14px #C3CCD9, -6px -6px 14px #FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <AlertTriangle size={40} style={{ color: '#3A6B7C' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Steady Recovery Mode</h2>
            <p style={{ fontSize: '13px', color: '#626D79', lineHeight: 1.5 }}>
              A rendering glitch was caught. Resetting storage will restore your onboarding workspace.
            </p>
            {this.state.error && (
              <pre
                style={{
                  fontSize: '11px',
                  backgroundColor: '#D1DBE8',
                  padding: '8px',
                  borderRadius: '8px',
                  width: '100%',
                  overflowX: 'auto',
                  textAlign: 'left',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#3A6B7C',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={16} /> Reset & Restart Onboarding
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
