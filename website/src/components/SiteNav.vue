<template>
  <ul class="nav">
    <li class="nav-item">
      <a href="/docs">Guide</a>
    </li>
    <li class="nav-item">
      <a href="/tutorial/tutorial.html">Tutorial</a>
    </li>
    <li class="nav-item">
      <a href="/themes">Themes</a>
    </li>
    <li class="nav-item">
      <a href="/blog">Blog</a>
    </li>
    <li class="nav-item">
      <a href="https://chat.saber.land" target="_blank" class="discord-link">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="discord"
          class="svg-inline--fa fa-discord fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"
          ></path>
        </svg>
      </a>
    </li>
    <li class="nav-item">
      <a href="https://github.com/saberland/saber" target="_blank" class="github-link">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="github"
          class="svg-inline--fa fa-github fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 496 512"
        >
          <path
            fill="currentColor"
            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
          ></path>
        </svg>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.nav {
  list-style: none;
  margin: 0;
  font-size: 1rem;
  height: 100%;
  padding-left: 0;

  & a {
    color: var(--text-light-color);
    display: flex;
    height: 100%;
    align-items: center;
    line-height: 1.7;

    &:hover,
    &.router-link-exact-active {
      color: var(--theme-color);
    }

    &.router-link-exact-active {
      box-shadow: inset 0 -2px 0 var(--theme-color);
    }
  }
}

.nav-item {
  &:not(:first-child) {
    margin-left: 20px;
  }

  & svg {
    width: 20px;
    height: 20px;
  }

  & .discord-link {
    color: #a3b7fb;

    &:hover {
      color: #6c83d4;
    }
  }
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    padding-bottom: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--border-color);

    & a {
      &.router-link-exact-active {
        box-shadow: none;
      }
    }
  }

  .nav-item {
    height: 30px;
  }

  .nav-item:not(:first-child) {
    margin-left: 0;
  }
}
</style>
