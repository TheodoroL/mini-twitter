import { PostView } from '../views/PostView.js';
import { ApiService } from '../repositories/api.js';

const BASE_URL = "https://mini-twitter-api-vy9q.onrender.com/api"

export class PostController {
  constructor(container) {
    this.container = container;
    this.api = new ApiService(BASE_URL);
  }

  async showFeed() {
    const token = localStorage.getItem('token');
    if (!token) return location.reload();

    try {
      const posts = await this.api.getAllPosts(token);
      const view = new PostView(this);
      view.render(this.container, posts);
    } catch (e) {
      alert(e.message);
    }
  }

  async handlePost(content) {
    const token = localStorage.getItem('token');
    if (!token) return location.reload();

    try {
      await this.api.createPost(content, token);
      this.showFeed();
    } catch (e) {
      alert(e.message);
    }
  }

  logout() {
    localStorage.clear();
    location.reload();
  }
}
