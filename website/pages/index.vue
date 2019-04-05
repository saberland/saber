<template>
  <div class="page-index">
    <div class="slogan">
      A framework <br>for building <br>modern static websites.
    </div>
    <div class="features">
      <div class="feature">
        <span>Stay up-to-date.</span> Saber is built on top of webpack, Vue, React and the tools you use on a daily basis.
      </div>
      <div class="feature">
        <span>Simple and familiar.</span> Saber is inspired by Hexo and Gatsby, designed with the simplicity-first philosophy in mind.
      </div>
      <div class="feature">
        <span>Best practices, for free.</span> Build a modern static website or blog with best practices baked in.
      </div>
    </div>
    <section>
      <saber-link
        class="getting-started"
        :to="$saber.getPageLink('./docs/index.md')">
        Getting Started →
      </saber-link>
    </section>
  </div>
</template>


<script>
export const attributes = {
  title: 'Saber.js',
  layout: 'index'
}

export default {

}
</script>

<style scoped>
.page-index {
  margin: 100px 0;
  color: var(--dark);
}

.slogan {
  font-size: 3rem;
  font-weight: 500;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

section {
  margin-top: 100px;
}

.getting-started {
  border: 2px solid transparent;
  color: white;
  background: var(--theme-color);
  padding: 15px 20px;
  font-weight: 500;
  font-size: 1.2rem;
  transition: background .2s ease-in-out;
  border-radius: 4px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.getting-started:hover {
  background: white;
  color: var(--theme-color);
  border-color: var(--theme-color);
}

.features {
  font-size: 1.3rem;
  margin-top: 60px;
  max-width: 600px;
}

.feature {
  color: #666;
  margin-top: 15px;
  & span {
    font-weight: bold;
    color: #000;
  }
}
</style>
