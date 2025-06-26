import { createRoot } from 'react-dom/client'

const SimpleApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontSize: '24px', 
      color: 'red', 
      backgroundColor: 'yellow',
      height: '100vh',
      width: '100vw'
    }}>
      <h1>APLICACIÓN FUNCIONANDO</h1>
      <p>Si puedes ver esto, React está trabajando correctamente.</p>
      <p>Hora: {new Date().toLocaleString()}</p>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<SimpleApp />);
