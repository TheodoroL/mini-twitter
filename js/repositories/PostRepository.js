/**
 * Classe responsável por operações de CRUD para posts.
 */
export class PostRepository {
    /**
     * URL base da API de posts.
     * @type {string}
     */
    baseUrl;
  
    /**
     * Cria uma instância do PostRepository.
     * @param {string} baseUrl URL base da API
     */
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    /**
     * Busca todos os posts publicados.
     * @param {string} token Token de autenticação Bearer
     * @returns {Promise<{ok: boolean, posts?: object[], error?: string}>}
     */
    async fetchAllPosts(token) {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
  
      if (!response.ok) return this._handleError(response.status)
  
      return { ok: true, posts: await response.json() }
    }
  
    /**
     * Busca os posts do usuário autenticado.
     * @param {string} token Token de autenticação Bearer
     * @returns {Promise<{ok: boolean, posts?: object[], error?: string}>}
     */
    async fetchMyPosts(token) {
      const response = await fetch(`${this.baseUrl}/my-posts`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
  
      if (!response.ok) return this._handleError(response.status)
  
      return { ok: true, posts: await response.json() }
    }
  
    /**
     * Cria um novo post com o conteúdo informado.
     * @param {string} token Token de autenticação Bearer
     * @param {string} content Conteúdo do post
     * @returns {Promise<{ok: boolean, post?: object, error?: string}>}
     */
    async createPost(token, content) {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })
  
      if (!response.ok) return this._handleError(response.status)
  
      return { ok: true, post: await response.json() }
    }
  
    /**
     * Exclui um post pelo ID informado.
     * @param {string} token Token de autenticação Bearer
     * @param {string} postId ID do post a ser excluído
     * @returns {Promise<{ok: boolean, error?: string}>}
     */
    async deletePost(token, postId) {
      const response = await fetch(`${this.baseUrl}/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
  
      if (!response.ok) return this._handleError(response.status, true)
  
      return { ok: true }
    }
  
    /**
     * Trata erros da API, mapeando códigos HTTP para mensagens amigáveis.
     * @param {number} status Código HTTP da resposta
     * @param {boolean} [isDelete=false] Indica se é uma operação de exclusão
     * @returns {{ok: false, error: string}} Objeto com erro tratado
     * @private
     */
    _handleError(status, isDelete = false) {
      if (status === 401) return { ok: false, error: 'Token inválido ou expirado' }
      if (status === 500) return { ok: false, error: 'Erro interno do servidor' }
      if (isDelete && status === 404) return { ok: false, error: 'Não foi possível encontrar ou excluir o post' }
      return { ok: false, error: 'Erro desconhecido' }
    }
  }
  