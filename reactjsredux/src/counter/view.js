import React from 'react';

export const View = ({count, handleDecrementClick, handleIncrementClick}) => (
    <div>
        <h1>Hello world React & Redux!<br/> {count}</h1>
        <button onClick={handleDecrementClick}>Decrement</button>
        <button onClick={handleIncrementClick}>Increment</button>
    </div>
);
