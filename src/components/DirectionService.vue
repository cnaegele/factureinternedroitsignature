<template>
  <div class="directions-container">
    <h3 class="title">Directions et Services - Ville de Lausanne</h3>
    
    <div class="directions-list">
      <div 
        v-for="direction in directions" 
        :key="direction.iduo"
        class="direction-item"
      >
        <!-- En-tête de la direction -->
        <div 
          class="direction-header"
          @click="toggleDirection(direction.iduo)"
          :class="{ 'expanded': expandedDirections.has(direction.iduo) }"
        >
          <div class="direction-info">
            <span class="direction-name">{{ direction.nomuo }}</span>
          </div>
          <div class="direction-toggle">
            <svg 
              class="chevron"
              :class="{ 'rotated': expandedDirections.has(direction.iduo) }"
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </div>

        <!-- Liste des services (collapsible) -->
        <Transition name="slide">
          <div 
            v-if="expandedDirections.has(direction.iduo)" 
            class="services-container"
          >
            
            <div class="services-list">
              <div 
                v-for="service in direction.services" 
                :key="service.iduo"
                class="service-item"
                @click="choixService(service.iduo, service.descriptionuo)"
              >
                <div class="service-info">
                  <span class="service-name">{{ service.nomuo }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Service, Direction, ApiResponseDS } from '@/axioscalls.ts'
import { ref } from 'vue'
import { useDataStore } from '@/stores/datastore.ts'
import { getDirectionsServices } from '@/axioscalls.ts'
const lesDatas = useDataStore()
console.log(lesDatas)
const expandedDirections = ref<Set<number>>(new Set())
const response: ApiResponseDS = await getDirectionsServices()
const directions: Direction[] = response.success && response.data ? response.data : []
console.log(directions)

const toggleDirection = (directionId: number) => {
    if (expandedDirections.value.has(directionId)) {
        expandedDirections.value.delete(directionId)
    } else {
        expandedDirections.value.add(directionId)
    }
}

const choixService = (serviceId: number, serviceDescription: string) =>{
    console.log(serviceId)
    lesDatas.idService = serviceId   
    lesDatas.descriptionService = serviceDescription   
}
</script>

<style scoped>
.directions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.5rem;
  font-weight: 300;
}

.directions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.direction-item {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.direction-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.direction-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s ease;
}

.direction-header:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.direction-header.expanded {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.direction-info {
  flex: 1;
}

.direction-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: inherit;
}

.direction-description {
  font-size: 1rem;
  margin: 0 0 8px 0;
  opacity: 0.9;
  color: inherit;
}

.direction-code {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: inherit;
}

.direction-toggle {
  margin-left: 16px;
}

.chevron {
  transition: transform 0.3s ease;
  color: inherit;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.services-container {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  cursor: pointer;
}

.services-list {
  padding: 0 24px 24px;
  display: grid;
  gap: 12px;
}

.service-item {
  background: white;
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  transition: all 0.3s ease;
  position: relative;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  border-left-color: #0056b3;
}

.service-info {
  position: relative;
}

.service-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.service-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.service-code {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 3px 6px;
  background: #e9ecef;
  color: #495057;
  border-radius: 3px;
}

/* Animations de transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 2000px;
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .directions-container {
    padding: 16px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .direction-header {
    padding: 20px;
  }
  
  .direction-name {
    font-size: 1.2rem;
  }
  
  .services-list {
    padding: 0 20px 20px;
  }
  
  .service-item {
    padding: 16px;
  }
}
</style>
