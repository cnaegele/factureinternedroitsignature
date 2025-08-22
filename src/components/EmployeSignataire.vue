<template>
<div class="employes-container">
    <h3>Employes avec droit de signature pour le service<br>{{ lesDatas.descriptionService }}</h3>
    
    <!-- Message si aucun employé -->
    <div v-if="lesDatas.employesSignataire.length === 0" class="no-data">
      Aucun employé trouvé pour ce service
    </div>
    
    <!-- Liste des employés -->
    <div v-else class="employes-list">
      <div 
        v-for="employe in lesDatas.employesSignataire" 
        :key="employe.id" 
        class="employe-card"
        :class="{ 'employe-inactif': !employe.actif }"
      >
        <!-- Nom et prénom avec tooltip unité -->
        <div class="employe-info">
          <span 
            class="employe-nom" 
            :title="employe.unite"
          >
            {{ employe.nom }} {{ employe.prenom }}
          </span>
          <span v-if="!employe.actif" class="badge-inactif">Inactif</span>
        </div>
        
        <!-- Montant max modifiable -->
        <div class="employe-montant">
          <label>Montant maximum:</label>
          <input 
            v-model.number="employe.montantmax" 
            type="number" 
            step="0.01"
            min="0"
            class="input-montant"
            @change="onMontantChange(employe)"
          />
          <span class="currency">CHF</span>
        </div>
        
        <!-- Radio button pour principal (un seul sélectionnable) -->
        <div class="employe-principal">
          <label class="radio-label">
            <input 
              type="radio" 
              :name="'principal-' + lesDatas.idService"
              :value="employe.id" 
              :checked="employe.principal === 1"
              @change="setPrincipal(employe.id)"
            />
            <span class="radio-text">Principal</span>
          </label>
        </div>
        
        <!-- Bouton supprimer -->
        <div class="employe-actions">
          <button 
            @click="supprime(employe.id)"
            class="btn-delete"
            :title="`Supprimer ${employe.nom} ${employe.prenom}`"
          >
            <!-- Icône poubelle (vous pouvez utiliser une icône de votre choix) -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Employe } from '@/stores/datastore.ts'
import type { ApiResponseEmpS } from '@/axioscalls.ts'
import { ref, watch } from 'vue'
import { useDataStore } from '@/stores/datastore.ts'
import { getEmployesSignataire } from '@/axioscalls.ts'
const lesDatas = useDataStore()
watch(() => lesDatas.idService, async (newValue) => {
    console.log(`service choisi: ${lesDatas.idService}`)
    const response: ApiResponseEmpS = await getEmployesSignataire(newValue)
    lesDatas.employesSignataire = response.success && response.data ? response.data : []
    console.log(lesDatas.employesSignataire)
})

// Fonction pour gérer le changement de montant max
const onMontantChange = (employe: Employe) => {
  console.log(`Montant modifié pour ${employe.nom}: ${employe.montantmax}`)
  // Ici vous pouvez ajouter la logique pour sauvegarder automatiquement
  // ou marquer l'employé comme modifié
}

// Fonction pour définir l'employé principal
const setPrincipal = (employeId: number) => {
  // Remettre tous les employés à principal = 0
  lesDatas.employesSignataire.forEach(emp => {
    emp.principal = emp.id === employeId ? 1 : 0
  })
  
  console.log(`Employé principal défini: ${employeId}`)
  // Ici vous pouvez ajouter la logique pour sauvegarder
}

// Fonction supprime (signature seulement, à implémenter selon vos besoins)
const supprime = (id: number) => {
  // Cette fonction sera implémentée selon vos besoins
  console.log(`Suppression demandée pour l'employé ID: ${id}`)
}
</script>

<style scoped>
.employes-container {
  padding: 20px;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px;
}

.employes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.employe-card {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 15px;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  transition: box-shadow 0.2s;
}

.employe-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.employe-inactif {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.employe-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.employe-nom {
  font-weight: 500;
  cursor: help;
  color: #333;
}

.badge-inactif {
  background: #ffc107;
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 500;
}

.employe-montant {
  display: flex;
  align-items: center;
  gap: 8px;
}

.employe-montant label {
  font-size: 0.9em;
  color: #666;
  white-space: nowrap;
}

.input-montant {
  width: 100px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
}

.input-montant:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.currency {
  color: #666;
  font-size: 0.9em;
}

.employe-principal {
  display: flex;
  justify-content: center;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.9em;
}

.radio-text {
  color: #666;
}

.employe-actions {
  display: flex;
  justify-content: center;
}

.btn-delete {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:hover {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-delete:active {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .employe-card {
    grid-template-columns: 1fr;
    gap: 10px;
    text-align: left;
  }
  
  .employe-montant,
  .employe-principal,
  .employe-actions {
    justify-self: start;
  }
}
</style>