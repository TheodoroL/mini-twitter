export class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async login(email, password) {
    const res = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error('Email ou senha inválidos');
    return res.json();
  }

  async register(username, email, password) {
    const res = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!res.ok) throw new Error('Erro no cadastro');
    return res.json();
  }

  async getAllPosts(token) {
    const res = await fetch(`${this.baseURL}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Erro ao carregar posts públicos');
    return res.json();
  }

  async createPost(content, token) {
    const res = await fetch(`${this.baseURL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    if (!res.ok) throw new Error('Erro ao postar');
    return res.json();
  }
}
