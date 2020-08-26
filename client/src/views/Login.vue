<template>
  <section>
    <h1 class="text-center mt-5 mb-5">Login</h1>
    <div v-if="loading" class="text-center">
      <img src="../assets/pacman_loading.svg" />
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <form v-if="!loading" @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="user.email"
          type="text"
          class="form-control"
          id="emailLogin"
          aria-describedby="emailLoginHelp"
          placeholder="Enter Email"
          required
        />
        <h5 id="emailLoginHelp" class="form-text text-muted">
          Enter your email to login
        </h5>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="passwordLogin"
          aria-describedby="passwordLoginHelp"
          placeholder="Enter a password"
          required
        />
        <h5 id="passwordLoginHelp" class="form-text text-muted">
          Enter your password to login.
        </h5>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </section>
</template>

<script>
import Joi from 'joi';
import axios from 'axios';

const serverUrl = process.env.VUE_APP_SERVER_URL;

const schema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
});

export default {
  data: () => ({
    errorMessage: '',
    loading: false,
    user: {
      email: '',
      password: '',
    },
  }),
  watch: {
    // Watch for when user changes
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    async login() {
      this.errorMessage = '';
      if (this.validUser()) {
        const formData = {
          email: this.user.email,
          password: this.user.password,
        };

        this.loading = true;

        try {
          const res = await axios.post(
            `${serverUrl}/api/v1/auth/login`,
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          localStorage.token = res.data.token;
          setTimeout(() => {
            this.loading = false;
            this.$router.push('/dashboard');
          }, 1000);
        } catch (error) {
          setTimeout(() => {
            this.loading = false;
            this.errorMessage = error.response.data.message;
          }, 1000);
        }
      }
    },
    validUser() {
      const result = schema.validate(this.user);

      if (result.error === undefined) {
        return true;
      }

      if (result.error.message.includes('email')) {
        this.errorMessage = 'Please enter valid email 😟';
      } else {
        this.errorMessage = 'Please enter valid password 😟';
      }

      return false;
    },
  },
};
</script>

<style></style>
