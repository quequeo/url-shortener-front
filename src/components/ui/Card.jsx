import React from 'react';
import './Card.css';

export default function Card({
    children,
    className = '',
    title,
    description,
    ...props
}) {
    return (
        <div className={`card ${className}`} {...props}>
            {title && <h3 className="card-title">{title}</h3>}
            {description && <p className="card-description">{description}</p>}
            {children}
        </div>
    );
}
