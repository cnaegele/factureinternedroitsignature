
<template>
  <header>
    <h2>Gestion des droits de signature des factures internes</h2>
  </header>

  <main>
    <div id="app">
      <div  class="flex-container">
        <div><suspense><DirectionService></DirectionService></suspense></div>
        <div><suspense><EmployeSignataire></EmployeSignataire></suspense></div>
        <div>Choix employes</div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import DirectionService from './components/DirectionService.vue'
import EmployeSignataire from './components/EmployeSignataire.vue'
</script>


<style scoped>

</style>