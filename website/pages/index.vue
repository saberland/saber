<template>
  <div class="page-index small-container">
    <div class="slogan">
      <span class="logo"></span>
      <div class="slogan-content">
        A framework
        <br>for building
        <br>modern static websites.
      </div>
    </div>
    <div class="features">
      <div class="feature">
        <span>Static Rendering.</span> With Saber, static rendering with Vue.js is easier now than ever.
      </div>
      <div class="feature">
        <span>Zero Setup.</span> Automatic code splitting, file-system based routing, hot code reloading and built-in Markdown support.
      </div>
      <div class="feature">
        <span>Bring Your Own Data.</span>
        Build sites with the data you want: Pull data from headless CMS, SaaS services, APIs, your file-system, and more.
      </div>
      <div class="feature">
        <span>Fully Extensible.</span> With Saber's powerful APIs and plugin system, you can customize almost everything.
      </div>
    </div>
    <section>
      <saber-link
        class="getting-started"
        :to="$saber.getPageLink('./docs/index.md')"
      >Getting Started →</saber-link>
    </section>
  </div>
</template>


<script>
export const attributes = {
  layout: 'index'
}

import { version } from 'saber/functions'

console.log(version())

export default {}
</script>

<style scoped>
.page-index {
  color: var(--text-dark-color);
  margin-top: 20px;
  margin-bottom: 50px;
}

.logo {
  background-color: #f5f5f5;
  background-image: url(../images/logo-square.jpeg);
  border-radius: 940922px;
  background-size: cover;
  height: 140px;
  width: 140px;
  display: block;
  margin-right: 30px;

  &:hover {
    animation: rotation .3s infinite linear;
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 40px;
    margin-left: auto;
    margin-right: auto;
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.slogan {
  font-size: 2.4rem;
  font-weight: 500;
  line-height: 1.2;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 2rem;
    flex-direction: column;
    align-items: baseline;
    text-align: center;

    & .slogan-content {
      width: 100%;
    }
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
  transition: background 0.2s ease-in-out;
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
}

.feature {
  color: #666;
  margin-top: 20px;
  & span {
    font-weight: bold;
    color: #000;
  }
  & p {
    margin: 5px 0 0 0;
    font-size: 1.1rem;
  }
}
</style>
