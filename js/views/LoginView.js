export class LoginView {
  constructor(controller) {
    this.controller = controller;
  }

  handleGoRegisterClick(e) {
    e.preventDefault();
    this.controller.showRegister();
  };

  handleLoginFormSubmit(e) {
    e.preventDefault();
    const [email, password] = e.target.querySelectorAll('input');
    this.controller.handleLogin(email.value, password.value);
  };

  render(container) {
    container.innerHTML = `
      <main id="login-container">
        <h1 class="login-title">Login</h1>
        <form id="login-form">
          <div class="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              autocomplete="email"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
              autocomplete="current-password"
            />
          </div>
          <div class="form-group">
            <input type="submit" value="Entrar" class="submit-btn" />
          </div>
        </form>
        <div class="register-link">
          <a href="#" id="go-register">Não tem conta? Cadastre-se</a>
        </div>
      </main>
    `;

    document.getElementById('go-register').onclick = this.handleGoRegisterClick.bind(this);
    document.getElementById('login-form').onsubmit = this.handleLoginFormSubmit.bind(this);
  }
}

