<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-text>
              <div class="ion-text-center">
                <h1>Challenge Detail</h1>
              </div>
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-card>
              <img :src="challenge.imageUrl !== '' ? challenge.imageUrl : 'https://source.unsplash.com/J154nEkpzlQ'">
              <ion-card-header>
                <ion-card-title>{{ challenge.title }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                {{ challenge.pitch }}
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <div v-for="activity in challenge.activities" :key="activity.type">
          <ion-row>
            <ion-col>
              <ion-text v-if="activity.type === 'walking'">
                <div class="ion-text-center">
                  <h3>{{ activity.type.toUpperCase() }}</h3>
                </div>
              </ion-text>
              <ion-text color="danger">
                <div class="ion-text-center">
                  <p>
                    รวม {{ totalSteps }} ก้าว เป้าหมายคือ {{ activity.steps }} ก้าว
                  </p>
                </div>
              </ion-text>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-list>
                <ion-item v-for="record in activity_records.filter(d => d.type === activity.type)"
                          :key="record.id">
                  <ion-label>
                    {{ record.startDateTime.toDate().toLocaleString() }}
                    <p>
                      Steps {{ record.steps }}
                      Est. calories {{ record.estimatedCalories.toFixed(1) }}
                    </p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-col>
          </ion-row>
        </div>
      </ion-grid>
      <ion-fab vertical="top" horizontal="start" slot="fixed">
        <ion-fab-button @click="$router.push({ name: 'Home' })">
          <ion-icon :icon="arrowBackCircle"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import { doc, getDoc } from "firebase/firestore";
import {db} from "@/firebase";
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonList,
  IonItem,
  IonFabButton,
  IonFab,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle
} from '@ionic/vue';
import { arrowBackCircle, footstepsOutline } from 'ionicons/icons'
import {mapGetters, mapState} from "vuex";
import { useRoute } from "vue-router";

export default {
  name: "ChallengeDetail",
  components: {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonFabButton,
    IonFab,
    IonIcon,
  },
  setup () {
    return {
      arrowBackCircle,
      footstepsOutline
    }
  },
  data () {
    return {
      challenge: {},
      route: null,
    }
  },
  computed: {
    ...mapState(['activity_records']),
    ...mapGetters(['walkRecords']),
    totalSteps () {
      let total = 0
      this.walkRecords.forEach((r) => total = total + parseInt(r.steps))
      return total
    }
  },
  watch: {
    'route.params.recordId': async function() {
      const recordId = this.route.params.recordId
      if (recordId !== null && recordId !== undefined) {
        let docRef = doc(db, 'challenges', recordId)
        getDoc(docRef).then((snapshot) => {
          if (snapshot.exists()) {
            let data = snapshot.data()
            data.id = snapshot.id
            this.challenge = data
          }
        })
      }
    }
  },
  mounted() {
    this.route = useRoute()
  }
}
</script>

<style scoped>

</style>