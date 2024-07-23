import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import './styles/Header.css'

function Header() {
  const headerRef = useRef();
  document.addEventListener('scroll', () => {
    if(headerRef.current.offsetTop) headerRef.current.className = 'header shadow'
    else headerRef.current.className = 'header'
  })
  return (
    <>
      <div ref={headerRef} className='header'>
        <Link>
          <img src='pinterest.png' className='logo'/>
        </Link>
        <Link style={{marginLeft: '2vw', fontSize: '2.6vh', textDecoration: 'none'}}>Pinterest</Link>
        <Link style={{marginLeft: 'auto', fontSize: '2.4vh', textDecoration: 'none'}}>Name</Link>
      </div>
      {/* <div style={{height: 1, backgroundColor: 'black'}} /> */}
    </>
  )
}

export default Header;

