<template>
  <section>
    <h1 class="text-center mt-5 mb-5">Register</h1>
    <div v-if="loading" class="text-center">
      <img src="../assets/pacman_loading.svg" />
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
    <form v-if="!loading" @submit.prevent="register">
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input
          v-model="user.fullName"
          type="text"
          class="form-control"
          id="fullName"
          aria-describedby="fullNameHelp"
          placeholder="Enter your full name"
          required
        />
        <h5 id="fullNameHelp" class="form-text text-muted">Enter your full name</h5>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="user.email"
          type="email"
          class="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="Enter your email"
          required
        />
        <h5 id="emailHelp" class="form-text text-muted">Enter your email</h5>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="password">Password</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            id="password"
            aria-describedby="passwordHelp"
            placeholder="Password"
            required
          />
          <h5
            id="passwordHelp"
            class="form-text text-muted"
          >Password must be 10 or more characters long.</h5>
        </div>
        <div class="form-group col-md-6">
          <label for="confirmPassword">Confirm Password</label>
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            aria-describedby="confirmPasswordHelp"
            placeholder="Password"
            required
          />
          <h5 id="confirmPasswordHelp" class="form-text text-muted">Please confirm your password.</h5>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </section>
</template>

<script>
import Joi from "joi";
import { mapActions, mapMutations, mapState } from "vuex";

const schema = Joi.object().keys({
  fullName: Joi.string()
    .regex(/^([a-zA-Z'-.]+(?: [a-zA-Z'-.]+)?)$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  password: Joi.string().trim().min(10).required(),
  confirmPassword: Joi.string().trim().min(10).required(),
});

export default {
  data: () => ({
    user: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  }),
  computed: {
    ...mapState("auth", ["errorMessage", "loading"]),
  },
  watch: {
    // Watch for when user changes
    user: {
      handler() {
        this.setError("");
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations("auth", ["setError"]),
    ...mapActions("auth", ["registerUser"]),
    async register() {
      this.setError("");
      if (this.validUser()) {
        const formData = {
          fullName: this.user.fullName,
          email: this.user.email,
          password: this.user.password,
        };

        this.registerUser(formData);
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = "Passwords must match 😧";
        return false;
      }

      const result = schema.validate(this.user);

      if (result.error === undefined) {
        return true;
      }

      if (result.error.message.includes("fullName")) {
        this.setError("Please enter valid full name 😟");
      } else if (result.error.message.includes("email")) {
        this.setError("Please enter valid email 😟");
      } else {
        this.setError("Please enter valid password 😟");
      }

      return false;
    },
  },
};
</script>

<style></style>
