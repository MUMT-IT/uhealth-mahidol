<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-text>
              <div class="ion-text-center">
                <h1>Jog Record</h1>
              </div>
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-list-header>
              <ion-text>
                <h3>
                  New record / รายการใหม่
                </h3>
              </ion-text>
            </ion-list-header>
            <ion-list>
              <ion-item>
                <ion-label position="floating">Start</ion-label>
                <ion-datetime display-format="MMM DD, YYYY HH:mm" v-model="startDateTime"></ion-datetime>
              </ion-item>
              <ion-item class="ion-margin-bottom">
                <ion-label position="floating">Time (min)</ion-label>
                <ion-input type="number" min="0" step="100" v-model="min" placeholder="เวลาหน่วยเป็นนาที"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Steps</ion-label>
                <ion-input type="number" min="1" step="1" v-model="steps" placeholder="จำนวนก้าวโดยประมาณ"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Distance (km)</ion-label>
                <ion-input type="number" min="0.1" step="0.1" v-model="distance" placeholder="ระยะทางหน่วยกิโลเมตร"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Calculated calories</ion-label>
                <ion-input readonly :value="estimatedCal"></ion-input>
              </ion-item>
              <ion-item class="ion-margin-bottom">
                <ion-label position="floating">Calories (cal)</ion-label>
                <ion-input type="number" min="0" step="100" v-model="calories" placeholder="แคลอรีที่เผาผลาญโดยประมาณ"></ion-input>
              </ion-item>
              <ion-item lines="none">
                <ion-label>
                  Intensity <ion-icon :icon="helpCircleOutline" @click="presentAlert"></ion-icon>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-range v-model="intensity" pin="true" min="1" max="3" ticks="true" snaps="true">
                  <ion-label slot="start">1</ion-label>
                  <ion-label slot="end">3</ion-label>
                </ion-range>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button expand="block" color="success" @click="saveData" :disabled="!isFormValid">
              Save
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-fab vertical="top" horizontal="start" slot="fixed">
        <ion-fab-button @click="$router.push({ name: 'JogRecord' })">
          <ion-icon :icon="arrowBackCircle"></ion-icon>
        </ion-fab-button>
      </ion-fab>
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
  IonInput,
  IonDatetime,
  IonList,
  IonItem,
  IonButton,
  IonListHeader,
  IonLabel,
  IonRange,
  IonFab,
  IonFabButton,
  IonIcon, alertController, toastController,
} from '@ionic/vue';

import { helpCircleOutline, arrowBackCircle } from 'ionicons/icons'
import {defineComponent} from 'vue';
import { db } from '../../firebase'
import {collection, addDoc, Timestamp, getDocs, query, where, updateDoc, doc} from '@firebase/firestore'
import {mapGetters} from "vuex";

export default defineComponent({
  name: "JogRecordForm",
  components: {
    IonIcon,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonInput,
    IonDatetime,
    IonList,
    IonItem,
    IonButton,
    IonListHeader,
    IonLabel,
    IonRange,
    IonFab,
    IonFabButton,
  },
  setup () {
    return {
      helpCircleOutline,
      arrowBackCircle
    }
  },
  data () {
    return {
      startDateTime: new Date().toISOString(),
      min: 0,
      distance: 0,
      steps: 0,
      calories: 0,
      intensity: 1,
    }
  },
  computed: {
    ...mapGetters(['userId']),
    isFormValid () {
      return (this.startDateTime != '' || this.startDateTime != null)
    },
    estimatedCal () {
      let Cainten = 1
      if( this.intensity == 2){Cainten = 1.5}
      if( this.intensity == 2){Cainten = 2}
      return (this.min * 495) / 30 * Cainten
    }
  },
  methods: {
    async openGoalToast() {
      const toast = await toastController
          .create({
            header: "Goal Achieved!",
            color: "success",
            position: "top",
            message: 'ยินดีด้วย คุณได้บรรลุอีกหนึ่งเป้าหมาย',
            duration: 3000
          })
      return toast.present();
    },
    async openToast() {
      const toast = await toastController
          .create({
            color: "dark",
            message: 'เพิ่มรายการใหม่เรียบร้อยแล้ว',
            duration: 2000
          })
      return toast.present();
    },
    async presentAlert() {
      const alert = await alertController
          .create({
            cssClass: 'my-custom-class',
            header: 'Intensity Description',
            subHeader: 'คำอธิบายระดับความหนัก',
            message: '1 หมายถึงเบา พูดได้ปกติ<br>2 หมายถึงปานกลาง พูดได้ติดขัด<br>3 หมายถึงหนัก แทบพูดไม่ได้เลย',
            buttons: ['OK'],
          });
      await alert.present();

      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    },
    saveData () {
      if (this.isFormValid) {
        const ref = collection(db, 'activity_records')
        let data = {
          userId: this.userId,
          startDateTime: Timestamp.fromDate(new Date(this.startDateTime)),
          min: this.min,
          distance: this.distance,
          steps: this.steps,
          calories: this.calories,
          estimatedCalories: this.estimatedCal,
          createdAt: Timestamp.fromDate(new Date()),
          type: 'jogging',
          exerType: 'Cardio'
        }
        addDoc(ref, data).then(async (docRef) => {
          data.id = docRef.id
          let qSnapshot = await getDocs(query(collection(db, 'goals'),
              where('achieved', '==', false),
              where('type', '==', 'jogging'),
              where('userId', '==', this.$store.state.user.userId)))
          for (let g of qSnapshot.docs) {
            let cumulative_data = {
              cum_steps: 0,
              cum_distance: 0,
              cum_calories: 0,
            }
            let record = g.data()
            if (record.steps != 0) {
              cumulative_data['cum_steps'] = record.cum_steps + parseInt(data.steps)
              if (cumulative_data.cum_steps >= record.steps) {
                cumulative_data.achieved = true
              }
            }
            if (record.distance != 0) {
              cumulative_data['cum_distance'] = record.cum_distance + parseFloat(data.distance)
              if (cumulative_data.cum_distance >= record.distance) {
                cumulative_data.achieved = true
              }
            }
            if (record.calories != 0) {
              cumulative_data['cum_calories'] = record.cum_calories + parseFloat(data.calories)
              if (cumulative_data.cum_calories >= record.calories) {
                cumulative_data.achieved = true
              }
            }
            if (cumulative_data.achieved == true) {
              await this.openGoalToast()
            }
            await updateDoc(doc(db, 'goals', g.id), cumulative_data)
            if (cumulative_data.achieved == true) {
              this.$store.dispatch('resetGoalList', {id: g.id})
            }
          }
          this.$store.dispatch('insertActivity', data)
          await this.openToast()
          this.$router.push({name: 'JogRecord'})
        })
      } else {
        console.log('form not valid.')
      }
    }
  }
})
</script>

<style scoped>

</style>
