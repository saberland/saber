<template>
  <div>
    <div class="slogan">
      A framework <br>for building <br>modern static websites.
    </div>
    <section>
      <router-link class="getting-started" to="/docs/">Getting Started →</router-link>
    </section>
  </div>
</template>


<script>
export const attributes = {
  title: 'Saber.js'
}

export default {

}
</script>

<style scoped>
.slogan {
  font-size: 4rem;
  font-weight: bold;
  line-height: 1;
  margin-top: 80px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

section {
  margin-top: 100px;
}

.getting-started {
  border: 2px solid #000;
  color: #000;
  padding: 20px;
  font-weight: bold;
  font-size: 1.4rem;
  transition: background .3s ease-in-out;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.getting-started:hover {
  background: #000;
  color: #fff;
}
</style>
