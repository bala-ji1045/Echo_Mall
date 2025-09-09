import Link from 'next/link'
import React from 'react'

const AdminSidebar = () => {
  return (
    <div>
        <Link href={'/customer'}>customer</Link>
        <br />
        <Link href={'/hello'}>herllo</Link>
    </div>
  )
}

export default AdminSidebar