import React from 'react';

export default function TestComponent() {
  return (
    <div style={{ padding: '20px', fontSize: '18px', color: 'red' }}>
      <h1>Test Component - Si ves esto, React está funcionando</h1>
      <p>Fecha actual: {new Date().toLocaleString()}</p>
    </div>
  );
}