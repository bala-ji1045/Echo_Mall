import React from 'react'
import { logoutAction } from '../serveractions/logoutAction'
const Logout = () => {
  return (
    <div onClick={logoutAction}><button>Logout</button></div>
  )
}

export default Logout