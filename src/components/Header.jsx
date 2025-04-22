import { colors, gradients } from '../styles/colors';

const Header = () => {
  return (
    <header style={{ 
      background: gradients.primary,
      color: 'white',
      padding: '2rem 0',
      marginBottom: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>Quine-McCluskey Minimizer</h1>
        <p style={{
          fontSize: '1.1rem',
          opacity: 0.9,
          maxWidth: '800px'
        }}>
          A visual tool for minimizing boolean functions using the Quine-McCluskey algorithm
        </p>
      </div>
    </header>
  );
};

export default Header;