import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div>
        <Link href={'/home'}>Home</Link>
        <Link href={'/about'}>About</Link>
        <Link href={'/contact'}>Contact</Link>
        <Link href={'/login'}>Login</Link>
    </div>
  )
}

export default Navbar