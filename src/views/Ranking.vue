<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-center">
              <ion-text class="ion-text-lg-center">
                <h1>Challenge Standing</h1>
              </ion-text>
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-row v-for="ch in challenges" :key="ch.id">
              <ion-col>
                <ion-card>
                  <img :src="ch.imageUrl !== '' ? ch.imageUrl : 'https://source.unsplash.com/gJtDg6WfMlQ'">
                  <ion-card-header>
                    <ion-card-title>{{ ch.title }} Challenges</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    {{ ch.pitch }}
                    <ion-button @click="$router.push({ name: 'RankingChallenge', params: { recordId: ch.id}})">
                      View
                    </ion-button>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {mapState} from "vuex";
export default defineComponent({
  name: "Ranking",
  components: {
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
  },
  computed: {
    ...mapState(['user','challenges','profile'])
  }
});
</script>

<style scoped>

</style>
