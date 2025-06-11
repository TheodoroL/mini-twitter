import { AuthController } from "../controllers/AuthController.js";

/**
 * Classe responsável por renderizar e gerenciar a tela de cadastro de usuários.
 */
export class RegisterView {
  /** @type {AuthController} */
  controller;

  /**
   * @param {AuthController} controller - Instância do controlador de autenticação.
   */
  constructor(controller) {
    this.controller = controller;
  }

  /**
   * Exibe uma mensagem de erro na interface.
   * @param {string} message - Mensagem de erro a ser exibida.
   */
  showError(message) {
    const errorElement = this.controller.container.querySelector('#error-message');
    if (!errorElement) return;
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }

  /**
   * Oculta a mensagem de erro da interface.
   */
  hideError() {
    const errorElement = this.controller.container.querySelector('#error-message');
    if (!errorElement) return;
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
  }

  /**
   * Lida com o envio do formulário de cadastro.
   * @param {SubmitEvent} event - Evento de envio do formulário.
   * @private
   */
  async #handleFormSubmit(event) {
    event.preventDefault();

    const container = this.controller.container;
    const name = container.querySelector('#name')?.value.trim();
    const email = container.querySelector('#email')?.value.trim();
    const password = container.querySelector('#password')?.value;
    const confirmPassword = container.querySelector('#confirm-password')?.value;

    if (!name || !email || !password) {
      this.showError('Todos os campos são obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      this.showError('As senhas não coincidem');
      return;
    }

    this.hideError();

    const registerButton = container.querySelector('.auth-submit');
    if (!registerButton) return;

    registerButton.disabled = true;
    const originalContent = registerButton.innerHTML;
    registerButton.innerHTML = `<span class="spinner"></span>`;

    try {
      await this.controller.handleRegisterRequest(name, email, password);
    } finally {
      registerButton.innerHTML = originalContent;
      registerButton.disabled = false;
    }
  }

  /**
   * Renderiza o formulário de cadastro na tela.
   */
  render() {
    this.controller.container.innerHTML = `
      <main class="auth-container">
        <h1 class="auth-title">Cadastrar no Mini Twitter</h1>
        <form class="auth-form">
          <div class="auth-field">
            <label for="name">Nome de usuário:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="auth-field">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="auth-field">
            <label for="password">Senha:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="auth-field">
            <label for="confirm-password">Confirmação de Senha:</label>
            <input type="password" id="confirm-password" name="confirm-password" required>
          </div>
          <button type="submit" class="auth-submit">Registrar</button>
          <div class="auth-error hidden" id="error-message"></div>
          <div class="auth-alt-action">
            <p>Já tem uma conta? <button type="button" id="go-login">Entrar</button></p>
          </div>
        </form>
      </main>
    `;

    const form = this.controller.container.querySelector('.auth-form');
    form?.addEventListener('submit', this.#handleFormSubmit.bind(this));

    const loginButton = this.controller.container.querySelector('#go-login');
    loginButton?.addEventListener('click', () => this.controller.showLoginView());
  }
}
