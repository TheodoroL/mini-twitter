/**
 * Repositório responsável por operações relacionadas ao usuário autenticado.
 */
export class UserRepository {
    /** @type {string} */
    baseUrl;
  
    /**
     * @param {string} baseUrl - URL base da API de usuários.
     */
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    /**
     * Obtém os dados do perfil do usuário autenticado.
     * 
     * @param {string} token - Token JWT para autenticação.
     * @returns {Promise<{ok: true, user: object} | {ok: false, error: string}>}
     * Retorna o perfil do usuário se a requisição for bem-sucedida, ou uma mensagem de erro.
     */
    async getProfile(token) {
      try {
        const res = await fetch(`${this.baseUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (!res.ok)
          return { ok: false, error: 'Erro ao buscar perfil.' };
  
        const user = await res.json();
        return { ok: true, user };
      } catch {
        return { ok: false, error: 'Erro de conexão.' };
      }
    }
  
    /**
     * Atualiza os dados do perfil do usuário.
     * 
     * @param {string} token - Token JWT para autenticação.
     * @param {string} username - Novo nome de usuário.
     * @param {string} email - Novo email.
     * @returns {Promise<{ok: true, user: object} | {ok: false, error: string}>}
     * Retorna os dados atualizados do usuário ou uma mensagem de erro em caso de falha.
     */
    async updateProfile(token, username, email) {
      try {
        const res = await fetch(`${this.baseUrl}/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim()
          })
        });
  
        if (!res.ok)
          return {
            ok: false,
            error:
              res.status === 400
                ? 'Nome de usuário ou email já está em uso.'
                : res.status === 401
                ? 'Não autorizado.'
                : res.status === 404
                ? 'Usuário não encontrado.'
                : 'Erro ao atualizar perfil.'
          };
  
        const json = await res.json();
        return { ok: true, user: json.user };
      } catch {
        return { ok: false, error: 'Erro de conexão.' };
      }
    }
  }
  