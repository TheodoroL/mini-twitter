import { PostRepository } from "../repositories/PostRepository.js";
import { StorageRepository } from "../repositories/StorageRepository.js";
import { PostView } from "../views/PostView.js";
import { AuthController } from "./AuthController.js";
import { ProfileController } from "./ProfileController.js";

/**
 * Controlador responsável pelas operações relacionadas a posts,
 * integrando repositórios, visualizações e outras controllers.
 */
export class PostController {
  /**
   * Repositório para armazenamento local.
   * @type {StorageRepository}
   */
  storageRepository;

  /**
   * Repositório para comunicação com API de posts.
   * @type {PostRepository}
   */
  postRepository;

  /**
   * Container HTML onde a view será renderizada.
   * @type {HTMLElement}
   */
  container;

  /**
   * View responsável pela interface dos posts.
   * @type {PostView}
   */
  #postView;

  /**
   * Inicializa o controlador com o container e instância os repositórios e view.
   * @param {HTMLElement} container Elemento HTML para renderização da view
   */
  constructor(container) {
    this.container = container;
    this.postRepository = new PostRepository("https://mini-twitter-api-vy9q.onrender.com/api/posts");
    this.storageRepository = new StorageRepository();
    this.#postView = new PostView(this);
  }

  /**
   * Realiza logout do usuário limpando o armazenamento e mostrando a view de login.
   */
  handleLogout() {
    this.storageRepository.clear()
    new AuthController(this.container).showLoginView()
  }

  /**
   * Exibe a view do perfil do usuário.
   */
  async showProfile() {
    await new ProfileController(this.container).showProfileView()
  }

  /**
   * Exibe a view principal dos posts, carregando os posts existentes.
   */
  async showPostView() {
    const token = this.storageRepository.getItem('token')
    if (!token) return location.reload()

    this.#postView.render()
    await this.loadPosts()
  }

  /**
   * Carrega todos os posts e atualiza a view, mostrando erros se necessário.
   */
  async loadPosts() {
    const token = this.storageRepository.getItem('token')
    if (!token) return location.reload()

    try {
      const result = await this.postRepository.fetchAllPosts(token)

      if (result.ok)
        this.#postView.renderPosts(result.posts, JSON.parse(this.storageRepository.getItem('user')))
      else
        this.#postView.showError(result.error || 'Erro ao carregar posts.')
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
      this.#postView.showError('Não foi possível carregar os posts.')
    }
  }

  /**
   * Publica um novo post com o conteúdo fornecido e atualiza a view.
   * @param {string} content Conteúdo do novo post
   */
  async publishPost(content) {
    const token = this.storageRepository.getItem('token')
    if (!token) return location.reload()

    try {
      const result = await this.postRepository.createPost(token, content)

      if (result.ok)
        this.#postView.addPost(result.post, JSON.parse(this.storageRepository.getItem('user')), true)
      else
        this.#postView.showError(result.error || 'Erro ao publicar o post.')
    } catch {
      this.#postView.showError('Não foi possível publicar o post.')
    }
  }

  /**
   * Exclui um post pelo ID informado.
   * @param {string} postId ID do post a ser excluído
   * @returns {Promise<boolean|undefined>} True se excluído com sucesso, undefined caso contrário
   */
  async deletePost(postId) {
    const token = this.storageRepository.getItem('token')
    if (!token) return location.reload()

    try {
      const result = await this.postRepository.deletePost(token, postId)
      return result.ok
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      alert('Não foi possível excluir o post.')
    }
  }
}
