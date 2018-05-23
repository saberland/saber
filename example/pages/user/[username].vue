<template>
  <div>hi {{ $route.params.username }}</div>
</template>

<saber>
module.exports = {
  params() {
    return [
      {
        username: 'egoist'
      },
      {
        username: 'kchan'
      }
    ]
  }
}
</saber>
