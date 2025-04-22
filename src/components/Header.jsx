import { gradients } from '../styles/colors';

const Header = () => {
  return (
    <header style={{ 
      background: gradients.primary,
      color: 'white',
      padding: '3rem 0',
      marginBottom: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container">
        <div style={{
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>Quine-McCluskey Minimizer</h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            maxWidth: '800px',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            A visual tool for minimizing boolean functions using the Quine-McCluskey algorithm
            </p>
            <p style={{
            marginTop: '10px',
            fontSize: '.8rem',
            opacity: 0.9,
            maxWidth: '800px',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            Made by: Albert Caro and Josh Cimanes for CMSC 130
          </p>
        </div>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(138,43,226,0.2) 0%, rgba(138,43,226,0) 70%)',
          zIndex: 1
        }} />
      </div>
    </header>
  );
};

export default Header;