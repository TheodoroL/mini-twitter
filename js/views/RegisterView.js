
export class RegisterView {
  constructor(controller) {
    this.controller = controller;
  }

  render(container) {
    container.innerHTML = `
      <main id="login-container">
        <h1 class="login-title">Cadastro</h1>
        <form id="register-form">
          <div class="form-group">
            <input type="text" placeholder="Nome de usuário" required />
          </div>
          <div class="form-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div class="form-group">
            <input type="password" placeholder="Senha" required />
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
    document.getElementById('go-login').onclick = (e) => {
      e.preventDefault();
      this.controller.showLogin();
    };
    document.getElementById('register-form').onsubmit = (e) => {
      e.preventDefault();
      const [username, email, password] = e.target.querySelectorAll('input');
      this.controller.handleRegister(username.value, email.value, password.value);
    };
  }
}
