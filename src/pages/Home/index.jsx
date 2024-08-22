import { useEffect, useState, useRef } from 'react';
import './style.css';
import Lixeira from '../../assets/lixeira.png';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([]);
  const nomeRef = useRef(null);
  const idadeRef = useRef(null);
  const emailRef = useRef(null);

  
  async function getUsers() {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error.response?.data || error.message);
    }
  }


  useEffect(() => {
    getUsers();
  }, []);

  
  const handleRegister = async () => {
    const nome = nomeRef.current.value.trim();
    const idade = idadeRef.current.value.trim();
    const email = emailRef.current.value.trim();

  
    if (!nome || !idade || !email) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    if (isNaN(idade) || idade <= 0) {
      alert('Idade deve ser um número positivo.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('E-mail inválido.');
      return;
    }

    
    const userData = {
      name: nome,
      age: idade.toString(), 
      email: email
    };

    console.log('Dados a serem enviados:', userData);

    try {
     
      const existingUser = users.find(user => user.email === email);

      if (existingUser) {
        alert('Usuário já cadastrado com esse e-mail.');
        return;
      }


      const response = await api.post('/usuarios', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta do backend:', response.data);

      
      if (response.status === 200 || response.status === 201) {
        getUsers();
        nomeRef.current.value = '';
        idadeRef.current.value = '';
        emailRef.current.value = '';
      } else {
        alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.response?.data || error.message);
      alert(`Erro ao cadastrar usuário: ${error.response?.data?.error || 'Verifique os dados e tente novamente.'}`);
    }
  };

  
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/usuarios/${userId}`);
      getUsers(); 
    } catch (error) {
      console.error('Erro ao deletar usuário:', error.response?.data || error.message);
      alert(`Erro ao deletar usuário: ${error.response?.data?.error || 'Tente novamente mais tarde.'}`);
    }
  };

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Usuários</h1>
        <input ref={nomeRef} placeholder="Nome" name="nome" type="text" />
        <input ref={idadeRef} placeholder="Idade" name="idade" type="text" /> {
        }
        <input ref={emailRef} placeholder="E-mail" name="email" type="email" />
        <button type="button" onClick={handleRegister}>Cadastrar</button>
      </form>
      {users.map(user => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => handleDelete(user.id)}>
            <img src={Lixeira} className="lixeira" alt="Deletar" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
