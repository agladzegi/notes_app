import axios from 'axios';

const serverUrl = process.env.VUE_APP_SERVER_URL;

const state = {
  notes: [],
};

const actions = {
  async getNotes({ commit }) {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/notes`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      commit('setNotes', res.data);
    } catch (error) {
      commit('auth/setError', error.response.data.message);
    }
  },

  async addNewNote({ commit }, formData) {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/notes`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      commit('setNewNote', res.data);
    } catch (error) {
      commit('auth/setError', error.response.data.message);
    }
  },

  async delNote({ commit }, _id) {
    try {
      await axios.delete(`${serverUrl}/api/v1/notes/${_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      commit('delNote', _id);
    } catch (error) {
      commit('auth/setError', error.response.data.message);
    }
  },
};

const getters = {
  showNotes: (state) => state.notes,
};

const mutations = {
  setNotes: (state, notes) => (state.notes = notes),
  setNewNote: (state, note) => state.notes.push(note),
  delNote: (state, _id) => {
    state.notes = state.notes.filter((note) => note._id !== _id);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
