<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-text>
              <h1>Health</h1>
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <ion-list>
              <ion-item-group>
                <ion-item-divider>
                  <ion-label>Body</ion-label>
                </ion-item-divider>
                <ion-item inset="true" detail href="/tabs/home">
                  <ion-icon slot="start" :icon="waterOutline"></ion-icon>
                  <ion-label>
                    Lab tests
                    <p>ผลการตรวจทางห้องปฏิบัติการ</p>
                  </ion-label>
                </ion-item>
                <ion-item inset="true" detail @click="$router.push({name:'weight'})">
                  <ion-icon slot="start" :icon="scaleOutline"></ion-icon>
                  <ion-label>
                    Weight
                    <p>น้ำหนักตัว</p>
                  </ion-label>
                </ion-item>
                <ion-item inset="true" detail href="/tabs/home" class="ion-margin-bottom">
                  <ion-icon slot="start" :icon="manOutline"></ion-icon>
                  <ion-label>Body Composition</ion-label>
                </ion-item>
              </ion-item-group>
              <ion-item-group>
                <ion-item-divider>
                  <ion-label>Diet</ion-label>
                </ion-item-divider>
                <ion-item inset="true" detail @click="$router.push({name:'foodsearch'})">
                  <ion-icon slot="start" :icon="fastFoodOutline"></ion-icon>
                  <ion-label>
                    Food
                  </ion-label>
                </ion-item>
                <ion-item inset="true" detail @click="$router.push({name:'Drink'})">
                  <ion-icon slot="start" :icon="wineOutline"></ion-icon>
                  <ion-label>
                    Drink
                  </ion-label>
                </ion-item>
              </ion-item-group>
              <ion-item-group>
                <ion-item-divider>
                  <ion-label>Mind</ion-label>
                </ion-item-divider>
                <ion-item inset="true" detail @click="$router.push({name: 'MoodRecord'})">
                  <ion-icon slot="start" :icon="happyOutline"></ion-icon>
                  <ion-label>
                    Mood
                    <p>อารมณ์</p>
                  </ion-label>
                </ion-item>
                <ion-item inset="true" detail @click="$router.push({name: 'MeditationRecord'})" class="ion-margin-bottom">
                  <ion-icon slot="start" :icon="headsetOutline"></ion-icon>
                  <ion-label>
                    Meditation
                    <p>การฝึกสมาธิ</p>
                  </ion-label>
                </ion-item>
              </ion-item-group>
              <ion-item-group>
                <ion-item-divider>
                  <ion-label>
                    Personal
                  </ion-label>
                </ion-item-divider>
                <ion-item inset="true" detail @click="$router.push({name: 'Goal'})">
                  <ion-icon slot="start" :icon="trophyOutline"></ion-icon>
                  <ion-label>
                    Goals
                    <p>เป้าหมาย</p>
                  </ion-label>
                </ion-item>
                <ion-item inset="true" detail href="/milestones">
                  <ion-icon slot="start" :icon="flagOutline"></ion-icon>
                  <ion-label>
                    Milestones
                    <p>ความสำเร็จ</p>
                  </ion-label>
                </ion-item>
              </ion-item-group>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  waterOutline,
  alertCircleOutline,
  headsetOutline,
  trophyOutline,
  flagOutline,
  scaleOutline,
  manOutline,
  happyOutline,
    fastFoodOutline,
    wineOutline
} from 'ionicons/icons';

import {
  IonItemDivider,
  IonItemGroup,
  IonContent,
  IonPage,
  IonList,
  IonLabel,
  IonItem,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Profile',
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonItemDivider,
    IonItemGroup,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonText,
  },
  setup() {
    return {
      waterOutline,
      scaleOutline,
      headsetOutline,
      manOutline,
      trophyOutline,
      happyOutline,
      flagOutline,
      alertCircleOutline,
      fastFoodOutline,
      wineOutline
    }
  },
  mounted() {
  }
});
</script>

<style scoped>

</style>