/**
 * Classe responsável pela visualização e interação com postagens.
 */
export class PostView {
  /** @type {PostController} */
  controller;

  /** @type {number} */
  #lastPostsCount = 0;

  /**
   * @param {PostController} controller - Controlador de postagens.
   */
  constructor(controller) {
    this.controller = controller;
  }

  /**
   * Exibe uma mensagem de erro no feed de postagens.
   * 
   * @param {string|undefined} message - Mensagem de erro a ser exibida.
   */
  showError(message) {
    const postsFeed = this.controller.container.querySelector('.posts-feed');
    postsFeed.innerHTML = '';

    const errorMessageElement = this.controller.container.querySelector('.error-message');
    errorMessageElement.classList.remove('hidden');

    const paragraph = errorMessageElement.querySelector('p');
    paragraph.textContent = message || 'Algo deu errado ao carregar o feed.';
  }

  /**
   * Manipula a exclusão de uma postagem.
   * 
   * @param {Event} event - Evento de clique no botão de deletar.
   * @param {HTMLElement} postElement - Elemento da postagem no DOM.
   * @param {string} postId - ID da postagem.
   */
  async handleDeletePost(event, postElement, postId) {
    event.preventDefault();
    const deleteButton = event.currentTarget;
    deleteButton.disabled = true;
    deleteButton.innerHTML = `<span class="spinner red-spinner"></span>`;

    try {
      const success = await this.controller.deletePost(postId);
      if (success) postElement.remove();
    } catch {
      alert('Erro ao excluir a postagem. Tente novamente.');
    } finally {
      deleteButton.disabled = false;
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    }
  }

  /**
   * Manipula o envio de uma nova postagem.
   * 
   * @param {Event} event - Evento de clique no botão de publicar.
   */
  async onSubmitPost(event) {
    event.preventDefault();

    const input = this.controller.container.querySelector('.new-post-input');
    const content = input.value.trim();
    const postButton = this.controller.container.querySelector('.publish-btn');
    postButton.disabled = true;

    if (!content.length) {
      postButton.disabled = false;
      return;
    }

    postButton.innerHTML = `<span class="spinner"></span>`;

    try {
      await this.controller.publishPost(content);
    } catch {
      this.showError('Erro ao publicar a postagem. Tente novamente.');
    } finally {
      postButton.innerHTML = 'Publicar';
      postButton.disabled = false;
      input.value = '';
      this.controller.container.querySelector('.char-count').textContent = '0 / 280';
    }
  }

  /**
   * Renderiza a estrutura da tela de postagens.
   */
  render() {
    this.controller.container.innerHTML = `
      <header class="header">
        <div class="container header-container">
          <h1 class="logo">MINI TWITTER</h1>
          <div class="user-actions">
            <button class="btn profile-btn"><i class="fa-regular fa-user"></i></button>
            <button class="btn logout-btn"><i class="fa-solid fa-right-from-bracket"></i></button>
          </div>
        </div>
      </header>

      <main class="container">
        <section class="new-post">
          <textarea class="new-post-input" placeholder="digite o que você está pensando?" maxlength="280"></textarea>
          <div class="new-post-footer">
            <button class="btn publish-btn"><i class="fa-regular fa-paper-plane"></i></button>
          </div>
        </section>

        <section class="posts-feed">
          <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <span class="spinner"></span>
          </div>
        </section>

        <div class="error-message hidden">
          <p>Algo deu errado ao carregar o feed.</p>
          <button class="btn try-again">Tentar novamente</button>
        </div>
      </main>
    `;

    this.controller.container.querySelector('.logout-btn')
      .addEventListener('click', () => this.controller.handleLogout());

    this.controller.container.querySelector('.profile-btn')
      .addEventListener('click', () => this.controller.showProfile());

    this.controller.container.querySelector('.publish-btn')
      .addEventListener('click', this.onSubmitPost.bind(this));
  }

  /**
   * Renderiza todas as postagens no feed.
   * 
   * @param {object[]} posts - Lista de postagens.
   * @param {object|undefined} user - Usuário logado.
   */
  renderPosts(posts, user) {
    const lastPostsCount = this.#lastPostsCount;
    const postsFeed = this.controller.container.querySelector('.posts-feed');
    const scrollPosition = postsFeed.scrollTop;

    postsFeed.innerHTML = '';

    if (!posts.length) {
      postsFeed.innerHTML = '<p class="no-posts">Nenhuma postagem encontrada.</p>';
      return;
    }

    this.#lastPostsCount = posts.length;
    for (const post of posts) this.addPost(post, user);

    // Ajusta o scroll após renderizar
    postsFeed.scrollTop = lastPostsCount > 0
      ? scrollPosition + ((posts.length - lastPostsCount) * 100)
      : 0;
  }

  /**
   * Adiciona uma única postagem ao feed.
   * 
   * @param {object} post - Dados da postagem.
   * @param {object} user - Usuário logado.
   * @param {boolean} [isNew=false] - Se a postagem é nova (no topo).
   */
  addPost(post, user, isNew = false) {
    const postsFeed = this.controller.container.querySelector('.posts-feed');

    const postElement = document.createElement('article');
    postElement.classList.add('post-card');

    postElement.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <i class="fas fa-user user-icon"></i>
          <div class="post-info">
            <span class="user-name">${post.author.username}</span>
            <span class="separator">•</span>
            <span class="post-date">${new Date(post.createdAt).toLocaleDateString('pt-BR', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>
      <hr class="separator-hr">
      <div class="post-content">
        <p>${post.content}</p>
      </div>
    `;

    if (user.id === post.author._id) {
      const postActions = document.createElement('div');
      postActions.classList.add('post-actions');

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-btn');
      deleteButton.title = 'Excluir postagem';
      deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteButton.addEventListener('click', async e =>
        await this.handleDeletePost(e, postElement, post._id)
      );

      postActions.appendChild(deleteButton);
      postElement.appendChild(postActions);
    }

    isNew ? postsFeed.prepend(postElement) : postsFeed.append(postElement);
  }
}
