exports.pages = ({ createPage }) => {
  createPage({
    // Unique id for this page
    $id: 'random_1207829734',
    attributes: {
      title: 'Hello',
      layout: 'foo',
      permalink: '/'
    },
    // Used as the `<template`> part of a Vue component
    content: '<h2>hello {{ 1 + 1 }}</h2>'
  })
}
