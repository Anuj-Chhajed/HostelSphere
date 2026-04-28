import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

type TransitionConfig = {
  to: string;
  label: string;
  title: string;
  detail: string;
  accent?: string;
};

type TransitionState = (TransitionConfig & { phase: 'enter' | 'exit' }) | null;

type ContextValue = {
  transitionTo: (config: TransitionConfig) => void;
};

const PublicPageTransitionContext = React.createContext<ContextValue | undefined>(undefined);

const ENTER_MS = 520;
const HOLD_MS = 60;
const EXIT_MS = 480;

export const PublicPageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [transition, setTransition] = React.useState<TransitionState>(null);
  const timersRef = React.useRef<number[]>([]);
  const busyRef = React.useRef(false);

  React.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const queueTimeout = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  };

  const transitionTo = React.useCallback((config: TransitionConfig) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setTransition({ ...config, phase: 'enter', accent: config.accent || '#d8ff65' });

    queueTimeout(() => {
      navigate(config.to);

      queueTimeout(() => {
        setTransition((current) => (current ? { ...current, phase: 'exit' } : current));

        queueTimeout(() => {
          setTransition(null);
          busyRef.current = false;
        }, EXIT_MS);
      }, HOLD_MS);
    }, ENTER_MS);
  }, [navigate]);

  return (
    <PublicPageTransitionContext.Provider value={{ transitionTo }}>
      {children}
      {transition && (
        <div className={`page-handoff page-handoff--${transition.phase}`} style={{ ['--handoff-accent' as string]: transition.accent || '#d8ff65' }}>
          {/* Two curtain panels that meet in the center */}
          <div className="page-handoff__curtain page-handoff__curtain--top" />
          <div className="page-handoff__curtain page-handoff__curtain--bottom" />

          {/* Glowing accent line at the seam */}
          <div className="page-handoff__scanline" />

          {/* Minimal center badge */}
          <div className="page-handoff__badge">
            <div className="page-handoff__badge-icon">
              <Building2 size={16} strokeWidth={2.5} />
            </div>
            <span className="page-handoff__badge-label">{transition.label}</span>
          </div>
        </div>
      )}
    </PublicPageTransitionContext.Provider>
  );
};

const usePublicPageTransition = () => {
  const context = React.useContext(PublicPageTransitionContext);
  if (!context) {
    throw new Error('usePublicPageTransition must be used within PublicPageTransitionProvider');
  }
  return context;
};

type TransitionLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & TransitionConfig;

export const PublicTransitionLink: React.FC<TransitionLinkProps> = ({
  to,
  label,
  title,
  detail,
  accent,
  onClick,
  children,
  ...rest
}) => {
  const { transitionTo } = usePublicPageTransition();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    transitionTo({ to, label, title, detail, accent });
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
