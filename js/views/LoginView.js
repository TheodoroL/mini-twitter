import { AuthController } from "../controllers/AuthController.js";

/**
 * Representa a visualização da tela de login.
 */
export class LoginView {
  /** @type {AuthController} */
  controller;

  /**
   * @param {AuthController} controller - Instância do controlador de autenticação.
   */
  constructor(controller) {
    this.controller = controller;
  }

  /**
   * Exibe uma mensagem de erro na tela de login.
   * 
   * @param {string} message - Mensagem de erro a ser exibida.
   */
  showError(message) {
    const errorMessageElement = this.controller.container.querySelector('#error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove('hidden');
  }

  /**
   * Oculta a mensagem de erro da tela de login.
   */
  hideError() {
    const errorMessageElement = this.controller.container.querySelector('#error-message');
    errorMessageElement.textContent = '';
    errorMessageElement.classList.add('hidden');
  }

  /**
   * Manipula o envio do formulário de login.
   * 
   * @param {Event} event - Evento de submissão do formulário.
   * @private
   */
  async #onSubmit(event) {
    event.preventDefault();

    const email = this.controller.container.querySelector('#email').value;
    const password = this.controller.container.querySelector('#password').value;

    this.hideError();

    const loginButton = this.controller.container.querySelector('.auth-submit');
    loginButton.disabled = true;

    const originalButtonContent = loginButton.innerHTML;
    loginButton.innerHTML = `<span class="spinner"></span>`;

    try {
      await this.controller.handleLoginRequest(email, password);
    } finally {
      loginButton.innerHTML = originalButtonContent;
      loginButton.disabled = false;
    }
  }

  /**
   * Renderiza o formulário de login na interface e associa os eventos.
   */
  render() {
    this.controller.container.innerHTML = `
      <main class="auth-container">
        <h1 class="auth-title">Login</h1>
        <form class="auth-form">
          <div class="auth-field">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="auth-field">
            <label for="password">Senha:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="auth-submit">Entrar</button>
          <div class="auth-error hidden" id="error-message"></div>
          <div class="auth-alt-action">
            <p>Não tem uma conta? <button type="button" id="go-register">Registrar</button></p>
          </div>
        </form>
      </main>
    `;

    const form = this.controller.container.querySelector('.auth-form');
    form.addEventListener('submit', this.#onSubmit.bind(this));

    const registerButton = this.controller.container.querySelector('#go-register');
    registerButton.addEventListener('click', () => this.controller.showRegisterView());
  }
}
