<script>
  export let name;
</script>

<style lang="scss">
  @import '@/app';

  h1 {
    color: $color;
  }
</style>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the
    <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
    to learn how to build Svelte apps.
  </p>
</main>
