<template>
  <div >
    <div class=" container mt-5">
   <div class="jumbotron">
      <h1 class="display-4">Ошибка 404</h1>
      <p class="lead">Страница не найдена.</p>
      <hr class="my-4">
      <button class="btn btn-primary btn-lg" @click="$router.push({ path:`/`})" role="button">Домой</button>
  </div>
    </div>
 
  </div>
</template>

<script>
export default {
  name: 'pageNotFound',
}
</script>

<style scoped>

</style>
