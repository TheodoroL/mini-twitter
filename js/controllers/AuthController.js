import { AuthRepository } from "../repositories/AuthRepository.js";
import { StorageRepository } from "../repositories/StorageRepository.js";
import { LoginView } from "../views/LoginView.js";
import { RegisterView } from "../views/RegisterView.js";
import { PostController } from "./PostController.js";

/**
 * Controlador responsável por gerenciar a autenticação do usuário,
 * incluindo login, registro e navegação entre as views relacionadas.
 */
export class AuthController {
  /** 
   * Instância da view de login.
   * @type {LoginView} 
   */
  #loginView;

  /**
   * Instância da view de registro.
   * @type {RegisterView} 
   */
  #registerView;

  /**
   * Repositório para manipulação do armazenamento local.
   * @type {StorageRepository} 
   */
  storageRepository;

  /**
   * Repositório para comunicação com a API de autenticação.
   * @type {AuthRepository} 
   */
  authRepository;

  /**
   * Elemento HTML onde as views serão renderizadas.
   * @type {HTMLElement} 
   */
  container;

  /**
   * Inicializa o controlador com o container e cria instâncias dos repositórios e views.
   * @param {HTMLElement} container Elemento HTML para renderização das views
   */
  constructor(container) {
    this.container = container
    this.authRepository = new AuthRepository('https://mini-twitter-api-vy9q.onrender.com/api/auth')
    this.storageRepository = new StorageRepository()

    this.#loginView = new LoginView(this)
    this.#registerView = new RegisterView(this)
  }

  /**
   * Exibe a view de login.
   */
  showLoginView() {
    this.#loginView.render()
  }

  /**
   * Exibe a view de registro.
   */
  showRegisterView() {
    this.#registerView.render()
  }

  /**
   * Processa o pedido de login com email e senha.
   * Armazena dados do usuário e token se bem-sucedido ou exibe erro.
   * @param {string} email Email do usuário
   * @param {string} password Senha do usuário
   */
  async handleLoginRequest(email, password) {
    const result = await this.authRepository.login(email, password)

    if (result.ok) {
      this.storageRepository.clear() // limpa armazenamento antes de salvar dados novos
      this.storageRepository.setItem('token', result.token)
      this.storageRepository.setItem('user', JSON.stringify(result.user))
      new PostController(this.container).showPostView() // redireciona para feed após login
    } else this.#loginView.showError(result.error) // exibe mensagem de erro
  }

  /**
   * Processa o pedido de registro com nome, email e senha.
   * Armazena dados do usuário e token se bem-sucedido ou exibe erro.
   * @param {string} name Nome do usuário
   * @param {string} email Email do usuário
   * @param {string} password Senha do usuário
   */
  async handleRegisterRequest(name, email, password) {
    const result = await this.authRepository.register(name, email, password)

    if (result.ok) {
      this.storageRepository.setItem('token', result.token)
      this.storageRepository.setItem('user', JSON.stringify(result.user))
      new PostController(this.container).showPostView() // redireciona para feed após registro
    } else this.#registerView.showError(result.error) // exibe mensagem de erro
  }
}
