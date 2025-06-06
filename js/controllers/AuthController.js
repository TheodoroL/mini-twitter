import { LoginView } from '../views/LoginView.js';
import { RegisterView } from '../views/RegisterView.js';
import { ApiService } from '../repositories/api.js';
import { PostController } from './PostController.js';

const BASE_URL = 'https://mini-twitter-api-vy9q.onrender.com/api';

export class AuthController {
  constructor(container) {
    this.container = container;
    this.api = new ApiService(BASE_URL);
  }

  showLogin() {
    const view = new LoginView(this);
    view.render(this.container);
  }

  showRegister() {
    const view = new RegisterView(this);
    view.render(this.container);
  }

  async handleLogin(email, password) {
    try {
      const data = await this.api.login(email, password);
      localStorage.setItem('token', data.token);
      new PostController(this.container, this.api).showFeed();
    } catch (e) {
      alert(e.message);
    }
  }

  async handleRegister(username, email, password) {
    try {
      await this.api.register(username, email, password);
      alert('Cadastro feito com sucesso!');
      this.showLogin();
    } catch (e) {
      alert(e.message);
    }
  }
}
