import React from 'react';
import { Building2, Radio, ScanLine, Shield } from 'lucide-react';

type SystemLoaderProps = {
  title?: string;
  label?: string;
  detail?: string;
  accent?: string;
  variant?: 'screen' | 'panel' | 'compact';
};

const moduleSignals = [
  { label: 'auth', icon: Shield },
  { label: 'sync', icon: Radio },
  { label: 'scan', icon: ScanLine },
  { label: 'core', icon: Building2 },
];

export const SystemLoader: React.FC<SystemLoaderProps> = ({
  title = 'HOSTELSPHERE',
  label = 'secure system boot',
  detail = 'Synchronizing operational surfaces',
  accent = '#d8ff65',
  variant = 'screen',
}) => {
  return (
    <div className={`system-loader system-loader--${variant}`} style={{ ['--loader-accent' as string]: accent }}>
      <div className="system-loader__grid" />
      <div className="system-loader__glow" />
      <div className="system-loader__frame">
        <div className="system-loader__scan" />
        <div className="system-loader__header">
          <div className="system-loader__eyebrow">
            <Building2 size={16} />
            <span>{label}</span>
          </div>
          <div className="system-loader__signal">
            <span className="system-loader__dot" />
            live handshake
          </div>
        </div>

        <div className="system-loader__hero">
          <p className="system-loader__title">{title}</p>
          <p className="system-loader__detail">{detail}</p>
        </div>

        <div className="system-loader__modules">
          {moduleSignals.map(({ label: signalLabel, icon: Icon }, index) => (
            <div key={signalLabel} className="system-loader__module">
              <div className="system-loader__module-top">
                <Icon size={15} />
                <span>{signalLabel}</span>
              </div>
              <div className="system-loader__module-bar">
                <span style={{ animationDelay: `${index * 0.15}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemLoader;
