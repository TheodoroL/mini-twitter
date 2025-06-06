
export class PostView {
  constructor(controller) {
    this.controller = controller;
  }

  render(container, posts) {
    container.innerHTML = `
      <main>
        <h1 class="login-title">Bem-vindo ao Mini Twitter</h1>
        <form id="post-form">
          <textarea rows="3" placeholder="O que está acontecendo?" required></textarea>
          <div class="form-group">
            <input type="submit" value="Postar" class="submit-btn" />
          </div>
        </form>
        <button id="logout-btn">Sair</button>
        <section class="timeline">
          ${posts.map(p => `
            <div class="tweet">
              <strong>@${p.author.username}</strong>
              <p>${p.content}</p>
              <small>${new Date(p.createdAt).toLocaleString()}</small>
            </div>
          `).join('')}
        </section>
      </main>
    `;

    document.getElementById('post-form').onsubmit = (e) => {
      e.preventDefault();
      const content = e.target.querySelector('textarea').value;
      this.controller.handlePost(content);
    };

    document.getElementById('logout-btn').onclick = () => {
      this.controller.logout();
    };
  }
}
