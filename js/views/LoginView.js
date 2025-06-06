
export class LoginView {
  constructor(controller) {
    this.controller = controller;
  }

  render(container) {
    container.innerHTML = `
      <main id="login-container">
        <h1 class="login-title">Login</h1>
        <form id="login-form">
          <div class="form-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div class="form-group">
            <input type="password" placeholder="Senha" required />
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
    document.getElementById('go-register').onclick = (e) => {
      e.preventDefault();
      this.controller.showRegister();
    };
    document.getElementById('login-form').onsubmit = (e) => {
      e.preventDefault();
      const [email, password] = e.target.querySelectorAll('input');
      this.controller.handleLogin(email.value, password.value);
    };
  }
}
