<template>
  <span>
    <v-btn :color="color" class="mr-5" dark @click.stop="dialog = true">
      {{ label }}
    </v-btn>

    <v-dialog v-model="dialog" max-width="1000">
      <v-card>
        <v-card-title>
          {{ message }}
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="confirm()">
            Confirm
          </v-btn>

          <v-btn color="green darken-1" text @click="cancel()">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  props: {
    label: String,
    message: String,
    color: String,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    confirm() {
      this.$emit("confirm");
      this.dialog = false;
    },
    cancel() {
      this.$emit("cancel");
      this.dialog = false;
    },
  },
};
</script>

<style></style>
