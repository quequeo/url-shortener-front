import React from 'react';
import './Input.css';

export default function Input({
    label,
    error,
    className = '',
    id,
    ...props
}) {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`input-field ${error ? 'has-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
}
