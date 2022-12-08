import { useState } from 'react'
import FirebaseAuthService from '../FirebaseAuthService'

function LoginForm({ existingUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await FirebaseAuthService.loginUser(username, password)
      setUsername('')
      setPassword('')
    } catch (error) {
      alert(error.message)
    }
  }

  function handleLogout() {
    FirebaseAuthService.logoutUser()
  }

  async function handleResetPasswordEmail() {
    if (!username) {
      // ユーザーネーム（email）が入力されていない場合はアラート表示だけで何もしない
      alert('missing username')
      return
    }
    try {
      await FirebaseAuthService.sendPasswordResetEmail(username)
      alert('sent the password reset email')
    } catch (error) {
      alert(error.message)
    }
  }

  async function handleLoginWithGoogle() {
    try {
      await FirebaseAuthService.loginWithGoogle()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="login-form-container">
      {existingUser ? (
        <div className="row">
          <h3>Welcome, {existingUser.email}</h3>
          <button type="button" className="primery-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <label className="input-label login-label">
            Username (email):
            <input
              type="email"
              required
              value={username}
              // 1文字入力されるたびに、setUsernameを読んでReactの状態を変える
              // cf. onInput（どっちが新しいんだっけ？）
              // で、submitされた時に呼ばれる関数（handleSubmit）では、そのuserとemailの状態を使う
              onChange={e => setUsername(e.target.value)}
              className="input-text"
            />
          </label>
          <label className="input-label login-label">
            Password:
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-text"
            />
          </label>
          <div className="button-box">
            <button className="primary-button">Login</button>
            {/* type=buttonを指定すると、formを送るのを防いでくれる。
            上のボタンは何もtype指定していないので、多分？デフォルトの動作であるform送信をするってことかな。
             */}
            <button type="button" onClick={handleResetPasswordEmail} className="primary-button">
              Reset Password
            </button>
            <button type="button" onClick={handleLoginWithGoogle} className="primary-button">
              Login with Google
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default LoginForm
