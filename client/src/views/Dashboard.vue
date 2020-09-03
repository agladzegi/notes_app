<template>
  <section>
    <h1 class="text-center mt-5 mb-5">Dashboard</h1>
    <h1 v-if="!user">Getting user information...</h1>
    <h1 v-if="user">Hello, {{ user.fullName }}!! 👋</h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
    <button @click="logout()" class="btn btn-primary">Logout</button>
    <br />
    <br />
    <button @click="showForm = !showForm" class="btn btn-info">Toggle Form</button>
    <form v-if="showForm" @submit.prevent="addNote()">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          v-model="newNote.title"
          type="text"
          class="form-control"
          id="title"
          aria-describedby="titleHelp"
          placeholder="Enter a title"
          required
        />
        <small id="titleHelp" class="form-text text-muted">Enter a descriptive title for your note.</small>
      </div>
      <div class="form-group">
        <label for="note">Note</label>
        <textarea
          v-model="newNote.note"
          class="form-control"
          id="note"
          rows="3"
          placeholder="Enter your note"
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-success">Add Note</button>
    </form>
    <section v-if="notes.length > 0" class="row mt-3">
      <div class="col-6" v-for="note in notes" :key="note._id">
        <div class="card border-info mb-3">
          <div class="card-header">
            <h1>{{ note.title }}</h1>
          </div>
          <div class="card-body">
            <p class="card-text" v-html="renderMarkDown(note.note)"></p>
          </div>
          <div class="card-footer text-muted">
            <button @click="deleteNote(note._id)" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import MarkdownIt from "markdown-it";
import axios from "axios";

const md = new MarkdownIt();

const serverUrl = process.env.VUE_APP_SERVER_URL;

export default {
  data: () => ({
    showForm: false,
    user: null,
    errorMessage: "",
    newNote: {
      title: "",
      note: "",
    },
    notes: [],
  }),
  async mounted() {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      const user = await res.data;

      if (user) {
        this.user = user;
        this.getNotes();
      } else {
        this.logout();
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        this.$router.push("/");
      }

      this.errorMessage = error.response.data.message;
    }
  },
  methods: {
    renderMarkDown(note) {
      return md.render(note);
    },
    async getNotes() {
      try {
        const res = await axios.get(`${serverUrl}/api/v1/notes`, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        });

        this.notes = res.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async addNote() {
      this.errorMessage = "";
      try {
        const res = await axios.post(
          `${serverUrl}/api/v1/notes`,
          this.newNote,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
          }
        );

        this.notes.push(res.data);
        this.newNote = {
          title: "",
          note: "",
        };
        this.showForm = false;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async deleteNote(_id) {
      this.errorMessage = "";
      try {
        await axios.delete(`${serverUrl}/api/v1/notes/${_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        });

        this.notes = this.notes.filter((note) => note._id !== _id);
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>

<style>
.card {
  height: 90%;
}

.card-text img {
  width: 70%;
  display: block;
  margin: 0 auto;
}
</style>
