import axios from 'axios';
import router from '../../router/index';

const serverUrl = process.env.VUE_APP_SERVER_URL;

const state = {
  errorMessage: '',
  loading: false,
  user: null,
};

const actions = {
  async registerUser({ commit }, formData) {
    commit('setLoading', true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.token = res.data.token;
      setTimeout(() => {
        commit('setLoading', false);
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      localStorage.removeItem('token');
      setTimeout(() => {
        commit('setLoading', false);
        commit('setError', error.response.data.message);
      }, 1000);
    }
  },

  async loginUser({ commit }, formData) {
    commit('setLoading', true);

    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      localStorage.token = res.data.token;
      setTimeout(() => {
        commit('setLoading', false);
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      localStorage.removeItem('token');
      setTimeout(() => {
        commit('setLoading', false);
        commit('setError', error.response.data.message);
      }, 1000);
    }
  },

  async getUser({ commit }) {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      commit('setUser', res.data);
    } catch (error) {
      if (error.response.status === 401) {
        commit('logout');
      }

      commit('setError', error.response.data.message);
    }
  },
};

const mutations = {
  setError: (state, message) => (state.errorMessage = message),
  setLoading: (state, value) => (state.loading = value),
  setUser: (state, user) => (state.user = user),
  logout: () => {
    localStorage.removeItem('token');
    router.push('/');
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
