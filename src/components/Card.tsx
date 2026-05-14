import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
};

export function Card({ children, className = '', eyebrow, title }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {eyebrow ? <p className="card__eyebrow">{eyebrow}</p> : null}
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
