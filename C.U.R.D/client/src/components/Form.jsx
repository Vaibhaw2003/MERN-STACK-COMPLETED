import React from 'react'

const Form = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Form Component</h1>
        <form>
            <input type="text" placeholder="Enter your name" style={{ marginBottom: '10px', padding: '5px' }} />
            <input type="email" placeholder="Enter your email" style={{ marginBottom: '10px', padding: '5px' }} />
            <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>Submit</button>
        </form>
    </div>
  )
}

export default Form