import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <h2 style={styles.title}>Project Drop</h2>
      <p style={styles.text}>Secure & Seamless File Management</p>

      <div style={styles.iconLinks}>
        <a
          href="https://github.com/bandikarvijay"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          🐱
        </a>
        <a
          href="https://www.linkedin.com/in/b-v-vijaya-bhaskar-2a50592b4/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
          🔗
        </a>
        <a
          href="mailto:bandikar.v.vijay@gmail.com"
          title="Email"
        >
          ✉️
        </a>
      </div>

      <p style={styles.bottomText}>
        © 2025 <span style={styles.orange}>Project Drop</span>. All rights reserved.<br />
        Developed by <span style={styles.orange}>BV VijayaBhaskar - AIML</span>
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: '50px',
    padding: '30px 10px',
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    zIndex: 2,
  },
  title: {
    marginBottom: '5px',
    color: '#a93e0b', // 🔶 Title in orange
  },
  text: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9,
  },
  iconLinks: {
    margin: '15px 0',
    fontSize: '26px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
  },
  bottomText: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#ccc',
  },
  orange: {
    color: '#a93e0b', // 🔶 Highlight color for brand & dev name
    fontWeight: 'bold',
  },
};

export default Footer;
