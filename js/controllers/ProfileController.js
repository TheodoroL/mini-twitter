import { UserRepository } from "../repositories/UserRepository.js";
import { StorageRepository } from "../repositories/StorageRepository.js";
import { ProfileView } from "../views/ProfileView.js";
import { PostController } from "./PostController.js";
import { PostRepository } from "../repositories/PostRepository.js";
import gateways from "../gateways.js";
import { AuthController } from "./AuthController.js";

/**
 * Controlador responsável por gerenciar as ações da tela de perfil.
 */
export class ProfileController {
  /** @type {UserRepository} */
  userRepository;
  /** @type {StorageRepository} */
  storageRepository;
  /** @type {PostRepository} */
  postRepository;
  /** @type {HTMLElement} */
  container;
  /** @type {ProfileView} */
  #profileView;

  /**
   * @param {HTMLElement} container - Elemento HTML que será usado como contêiner principal da view.
   */
  constructor(container) {
    this.container = container;
    this.userRepository = new UserRepository(gateways.USERS_URL);
    this.storageRepository = new StorageRepository();
    this.postRepository = new PostRepository(gateways.POSTS_URL);
    this.#profileView = new ProfileView(this);
  }

  /**
   * Realiza logout do usuário e exibe a tela de login.
   */
  handleLogout() {
    this.storageRepository.clear();
    new AuthController(this.container).showLoginView();
  }

  /**
   * Exclui uma postagem do usuário.
   * @param {string} postId - ID da postagem a ser excluída.
   * @returns {Promise<boolean|undefined>} - Retorna true se a exclusão for bem-sucedida.
   */
  async deletePost(postId) {
    const token = this.storageRepository.getItem("token");
    if (!token) return location.reload();

    try {
      const result = await this.postRepository.deletePost(token, postId);
      return result.ok;
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      alert("Não foi possível excluir o post.");
    }
  }

  /**
   * Exibe o feed de postagens.
   */
  async showFeed() {
    await new PostController(this.container).showPostView();
  }

  /**
   * Exibe a view de perfil do usuário logado.
   */
  async showProfileView() {
    const token = this.storageRepository.getItem("token");
    if (!token) return location.reload();

    try {
      const result = await this.userRepository.getProfile(token);
      if (result.ok) {
        this.#profileView.render(result.user);
        await this.#loadUserPosts();
      } else {
        this.#profileView.showError(result.error || "Erro ao carregar perfil.");
      }
    } catch (error) {
      this.#profileView.showError("Não foi possível carregar o perfil.");
    }
  }

  /**
   * Atualiza os dados do perfil do usuário.
   * @param {{username: string, email: string}} data - Dados atualizados do perfil.
   */
  async updateProfile(data) {
    const token = this.storageRepository.getItem("token");
    if (!token) return location.reload();

    try {
      const result = await this.userRepository.updateProfile(token, data.username, data.email);
      if (result.ok) {
        this.#profileView.render(result.user);
        this.storageRepository.setItem(
          "user",
          JSON.stringify({ id: result.user._id, ...result.user })
        );
        this.#profileView.showSuccess("Perfil atualizado com sucesso!");
        this.#loadUserPosts(); // Recarrega as postagens após a atualização do perfil
      } else {
        this.#profileView.showError(result.error || "Erro ao atualizar perfil.");
      }
    } catch (error) {
      this.#profileView.showError("Não foi possível atualizar o perfil.");
    }
  }

  /**
   * Carrega as postagens do usuário logado.
   * @private
   */
  async #loadUserPosts() {
    const token = this.storageRepository.getItem("token");
    if (!token) return location.reload();

    try {
      const result = await this.postRepository.fetchMyPosts(token);
      if (result.ok)
        this.#profileView.renderPosts(result.posts);
      else
        this.#profileView.showError(result.error || "Erro ao carregar postagens.");
    } catch (error) {
      this.#profileView.showError("Não foi possível carregar as postagens.");
    }
  }
}
