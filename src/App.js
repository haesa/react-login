import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [emailValid, setEmailValid] = useState(false);

  const onChange = (event) => {
    if(event.target.className === 'email'){
      setEmail(event.target.value);
      const reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      setEmailValid(reg.test(email));
    } else if(event.target.className === 'password'){
      setPw(event.target.value);
    }
  };
  console.log(`email: ${email}, pw: ${pw}`);

  const onSubmit = async (event) => {
    event.preventDefault();
    
    setQuery(
      `mutation{
        login (email: "${email}", password: "${pw}") {
          token
          user{
            id
            name
            email
          }
        }
      }`
    );
    const data = await (
      await fetch('https://graphql-ts.vercel.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
      })
    ).json();

    console.log(data);

    const msg = document.querySelector('.msg');
    if(data.data === null) {
      if(data.errors[0].message === 'No Such User Found') {
        setMessage('아이디가 잘못되었습니다.');
      } else if(data.errors[0].message === 'Invalid Password') {
        setMessage('비밀번호가 잘못되었습니다.');
      }
      msg.classList.add('fail');
    } else {
      setMessage(`Hi! ${data.data.login.user.name}`);
      const form = document.querySelector('.form');
      form.classList.add('success');
      msg.classList.add('success');
    }
  };
  
  return (
    <div className="login">
      <form onSubmit={onSubmit} onChange={onChange} className="form">
        <input 
          className="email"
          type="email" 
          placeholder="Email" 
          required 
          autoFocus/>
        <input 
          className="password"
          type="password"
          placeholder="Password"
          style={{
            display: `${emailValid ? 'inline' : 'none'}`,
          }}
          />
        <button>LOGIN</button>
      </form>
      <p className="msg">{message}</p>
    </div>
  );
}

export default App;