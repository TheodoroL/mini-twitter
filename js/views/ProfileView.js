import { ProfileController } from '../controllers/ProfileController.js';

/**
 * Classe responsável por renderizar e gerenciar a interface do perfil do usuário.
 */
export class ProfileView {
  /** @type {ProfileController} */
  controller;

  /**
   * @param {ProfileController} controller - Instância do controlador do perfil.
   */
  constructor(controller) {
    this.controller = controller;
  }

  /**
   * Renderiza a interface do perfil do usuário.
   * @param {object} user - Objeto com os dados do usuário logado.
   */
  render(user) {
    this.controller.container.innerHTML = `
      <header class="header">
        <div class="container header-container">
          <h1 class="logo">MINI TWITTER</h1>
          <div class="user-actions">
            <button class="btn feed-btn" id="back-feed"><i class="fa-solid fa-message"></i></button>
            <button class="btn logout-btn"><i class="fa-solid fa-right-from-bracket"></i></button>
          </div>
        </div>
      </header>
      <main class="profile-container">
        <section class="profile-info-card">
          <h1 class="profile-title"><i class="fa-solid fa-circle-user"></i></h1>
          <form class="profile-form">
            <div class="profile-field">
              <label for="username">Nome de usuário</label>
              <input type="text" id="username" name="username" value="${user.username}" required />
            </div>
            <div class="profile-field">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" value="${user.email}" required />
            </div>
            <div class="profile-field">
              <label>Data de criação</label>
              <input type="text" value="${new Date(user.createdAt).toLocaleString()}" disabled />
            </div>
            <button type="submit" class="profile-submit">Salvar</button>
            <div class="profile-message" id="profile-message"></div>
          </form>
        </section>
        <div class="profile-posts-section">
          <h2 class="profile-posts-title">Minhas Postagens</h2>
          <section class="posts-feed profile-posts-list">
            <div class="spinner-container">
              <span class="spinner"></span>
            </div>
          </section>
        </div>
      </main>
    `;

    const form = this.controller.container.querySelector('.profile-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        username: form.username.value,
        email: form.email.value,
      };
      this.controller.updateProfile(data);
    });

    const backButton = this.controller.container.querySelector('#back-feed');
    backButton?.addEventListener('click', () => this.controller.showFeed());

    const logoutButton = this.controller.container.querySelector('.logout-btn');
    logoutButton?.addEventListener('click', () => this.controller.handleLogout());
  }

  /**
   * Renderiza as postagens do usuário no perfil.
   * @param {object[]} posts - Lista de postagens do usuário.
   */
  renderPosts(posts = []) {
    const postsList = this.controller.container.querySelector('.profile-posts-list');
    if (!postsList) return;

    if (posts.length === 0) {
      postsList.innerHTML = '<p class="profile-no-posts">Você ainda não publicou nada.</p>';
      return;
    }

    postsList.innerHTML = '';
    posts.forEach((post) => this.addPost(postsList, post));
  }

  /**
   * Adiciona uma postagem individual ao DOM.
   * @param {HTMLElement} container - Contêiner onde o post será inserido.
   * @param {object} post - Objeto representando a postagem.
   */
  addPost(container, post) {
    const article = document.createElement('article');
    article.className = 'post-card';

    const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    article.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <i class="fas fa-user user-icon"></i>
          <div class="post-info">
            <span class="user-name">${post.author.username}</span>
            <span class="separator">•</span>
            <span class="post-date">${formattedDate}</span>
          </div>
        </div>
      </div>
      <hr class="separator-hr">
      <div class="post-content">
        <p>${post.content}</p>
      </div>
      <div class="post-actions"></div>
    `;

    const postActions = article.querySelector('.post-actions');
    const deleteButton = document.createElement('button');

    deleteButton.classList.add('delete-btn');
    deleteButton.title = 'Excluir postagem';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    deleteButton.addEventListener('click', async (event) => {
      await this.handleDeletePost(event, article, post._id);
    });

    postActions.appendChild(deleteButton);
    container.appendChild(article);
  }

  /**
   * Lida com a exclusão de uma postagem.
   * @param {Event} event - Evento de clique no botão de exclusão.
   * @param {HTMLElement} postElement - Elemento DOM da postagem a ser removida.
   * @param {string} postId - ID da postagem a ser excluída.
   */
  async handleDeletePost(event, postElement, postId) {
    event.preventDefault();

    const deleteButton = event.currentTarget;
    deleteButton.disabled = true;
    deleteButton.innerHTML = `<span class="spinner red-spinner"></span>`;

    try {
      const success = await this.controller.deletePost(postId);
      if (success) postElement.remove();
    } catch (error) {
      alert('Erro ao excluir a postagem. Tente novamente.');
    } finally {
      deleteButton.disabled = false;
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    }
  }

  /**
   * Exibe uma mensagem de erro na interface.
   * @param {string} msg - Mensagem de erro.
   */
  showError(msg) {
    const messageElement = this.controller.container.querySelector('#profile-message');
    if (messageElement) {
      messageElement.textContent = msg;
      messageElement.style.color = '#e0245e';
    }
  }

  /**
   * Exibe uma mensagem de sucesso na interface.
   * @param {string} msg - Mensagem de sucesso.
   */
  showSuccess(msg) {
    const messageElement = this.controller.container.querySelector('#profile-message');
    if (messageElement) {
      messageElement.textContent = msg;
      messageElement.style.color = '#1da1f2';
    }
  }
}
