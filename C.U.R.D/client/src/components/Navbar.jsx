import React from 'react'

const Navbar = () => {
  return (
    <div style={{ backgroundColor: '#333', color: '#fff', padding: '10px', textAlign: 'center' ,height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' ,textDecoration: 'none'}}>
        <h1 style={{ margin: 0 ,color: '#e44242',fontSize: '1.5rem'}}>Curd App</h1>
        <nav>
            <ul style={{ listStyle: 'none', display: 'flex', margin: 0, padding: 0 }}>
                <li><a href="/" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Home</a></li>
                <li><a href="/about" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>About</a></li>
                <li><a href="/contact" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Contact</a></li>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar