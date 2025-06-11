/**
 * Repositório responsável por autenticação de usuários via API.
 */
export class AuthRepository {
    /** @type {string} */
    baseUrl;
  
    /**
     * @param {string} baseUrl - URL base da API de autenticação.
     */
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    /**
     * Realiza o login de um usuário.
     * 
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Promise<{ok: true, user: object, token: string} | {ok: false, error: string}>}
     * Retorna um objeto com `ok: true` se o login for bem-sucedido, contendo usuário e token.
     * Caso contrário, retorna `ok: false` com uma mensagem de erro.
     */
    async login(email, password) {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok)
        return {
          ok: false,
          error:
            response.status === 401
              ? 'Email ou senha inválidos'
              : response.status === 500
              ? 'Erro interno do servidor'
              : 'Erro desconhecido'
        };
  
      const data = await response.json();
  
      return {
        ok: true,
        user: data.user,
        token: data.token
      };
    }
  
    /**
     * Registra um novo usuário.
     * 
     * @param {string} username - Nome de usuário.
     * @param {string} email - Email do novo usuário.
     * @param {string} password - Senha do novo usuário.
     * @returns {Promise<{ok: true, user: object, token: string} | {ok: false, error: string}>}
     * Retorna um objeto com `ok: true` se o registro for bem-sucedido, contendo usuário e token.
     * Caso contrário, retorna `ok: false` com uma mensagem de erro.
     */
    async register(username, email, password) {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
  
      if (!response.ok)
        return {
          ok: false,
          error:
            response.status === 400
              ? 'Usuário ou email já existente'
              : response.status === 500
              ? 'Erro interno do servidor'
              : 'Erro desconhecido'
        };
  
      const data = await response.json();
  
      return {
        ok: true,
        user: data.user,
        token: data.token
      };
    }
  }
  