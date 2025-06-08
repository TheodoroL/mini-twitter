export class RegisterView {
  constructor(controller) {
    this.controller = controller;
  }

  handleGoLoginClick(e) {
    e.preventDefault();
    this.controller.showLogin();
  };

  handleRegisterFormSubmit(e) {
    e.preventDefault();
    const [username, email, password] = e.target.querySelectorAll('input');
    this.controller.handleRegister(username.value, email.value, password.value);
  };

  render(container) {
    container.innerHTML = `
      <main id="login-container">
        <h1 class="login-title">Cadastro</h1>
        <form id="register-form">
          <div class="form-group">
            <input
              type="text"
              name="username"
              placeholder="Nome de usuário"
              required
              autocomplete="username"
            />
          </div>
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
              autocomplete="new-password"
            />
          </div>
          <div class="form-group">
            <input type="submit" value="Cadastrar" class="submit-btn" />
          </div>
        </form>
        <div class="register-link">
          <a href="#" id="go-login">Já tem conta? Faça login</a>
        </div>
      </main>
    `;

    document.getElementById('go-login').onclick = this.handleGoLoginClick;
    document.getElementById('register-form').onsubmit = this.handleRegisterFormSubmit;
  }
}
