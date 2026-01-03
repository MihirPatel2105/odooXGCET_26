import { useState } from 'react'
import './Auth.css'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <>
      {isSignUp ? (
        <SignUp />
      ) : (
        <SignIn />
      )}
    </>
  )
}
