import gateways from "../gateways.js";
import { PostRepository } from "../repositories/PostRepository.js";
import { StorageRepository } from "../repositories/StorageRepository.js";
import { PostView } from "../views/PostView.js";
import { AuthController } from "./AuthController.js";

export class PostController {
  /**
   * @type {StorageRepository}
   */
  storageRepository;

  /**
   * @type {PostRepository}
   */
  postRepository;

  /**
   * @type {HTMLElement}
   */
  container;

  /**
   * @type {PostView}
   */
  #PostView;

  #lastPostResponseSize = 0;

  constructor(container) {
    this.container = container;
    this.postRepository = new PostRepository(gateways.POSTS_URL);
    this.storageRepository = new StorageRepository();
    this.#PostView = new PostView(this);
  }

  handleLogout() {
    this.storageRepository.clear();
    new AuthController(this.container).showLoginView();
  }

  async showFeedView() {
    const token = this.storageRepository.getItem('token');
    if (!token) return location.reload();

    this.#PostView.render();
    await this.loadPosts();
  }

  async loadPosts() {
    const token = this.storageRepository.getItem('token');
    if (!token) return location.reload();

    try {
      const result = await this.postRepository.fetchAllPosts(token);

      if (result.ok) {
        this.#lastPostResponseSize = result.size || 0;
        this.#PostView.renderPosts(result.posts, JSON.parse(this.storageRepository.getItem('user')));
        await this.#watchNewPosts();
      } else {
        this.#PostView.showError(result.error || 'Erro ao carregar posts.');
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      this.#PostView.showError('Não foi possível carregar os posts.');
    }
  }

  async #watchNewPosts() {
    const token = this.storageRepository.getItem('token');
    if (!token) return location.reload();

    try {
      const result = await this.postRepository.fetchAllPostsResponseSize(token);

      if (!result.ok) {
        this.#PostView.showError(result.error || 'Erro ao carregar posts.');
        return;
      }

      if (result.size !== this.#lastPostResponseSize) {
        await this.loadPosts();
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      this.#PostView.showError('Não foi possível carregar os posts.');
    }

    setTimeout(async () => {
      await this.#watchNewPosts();
    }, 5000);
  }

  async publishPost(content) {
    const token = this.storageRepository.getItem('token');
    if (!token) return location.reload();

    try {
      const result = await this.postRepository.createPost(token, content);

      if (result.ok) {
        this.#PostView.addPost(result.post, JSON.parse(this.storageRepository.getItem('user')), true);
      } else {
        this.#PostView.showError(result.error || 'Erro ao publicar o post.');
      }
    } catch (error) {
      this.#PostView.showError('Não foi possível publicar o post.');
    }
  }

  async deletePost(postId) {
    const token = this.storageRepository.getItem('token');
    if (!token) return location.reload();

    try {
      const result = await this.postRepository.deletePost(token, postId);
      return result.ok;
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      alert('Não foi possível excluir o post.');
    }
  }
}