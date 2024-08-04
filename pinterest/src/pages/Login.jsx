import './styles/Auth.css'
import { useContext, useState } from "react"
import {Link} from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import Header from '../components/Header'

function Form({handleLogin}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    if(error) return
    try {
      await handleLogin(email, password)
    } catch (error) {
      setError(error?.response?.data)
    }
  }

  function handleInputChange(e, setState) {
    setError(null)
    setState(e.target.value)
  }

  return (
    <>
      <form onSubmit={onSubmit} className='form'>
        <div className='input-container'>
          <label htmlFor='email'>Email</label>
          <input value={email} onChange={(e) => handleInputChange(e, setEmail)} id="email" className='input' placeholder='Email' type='email' required autoComplete='false' />
          {error?.email && <div className='error'>The email you entered does not belong to any account.</div>}
        </div>
        <div className='input-container'>
          <label htmlFor='password'>Password</label>
          <input value={password} onChange={(e) => handleInputChange(e, setPassword)} id="password" className='input' placeholder='Password' type='password' required autoComplete='false'/>
          {error?.password && <div className='error'>The password you entered is incorrect.</div>}
        </div>
        <button type="submit" disabled={error} className='red-button'>log in</button>
      </form>
      <Link className='redirect' to='/signup'>
        Not on Pinterest yet? Sign up
      </Link>
      
    </>
  )
}

export default function Login() {

  const { isAuthenticated, user, handleLogin, handleLogout } = useContext(AuthContext);
  
  return (
    <>
      <Header />
      <div className='container'>
        <img src='pinterest.png' className='logo' />
        <div className='title'>Welcome to Pinterest</div>
        <Form handleLogin={handleLogin} />
      </div>
    </>
  )
}