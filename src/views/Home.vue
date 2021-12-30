<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-card>
              <ion-card-content>
                <ion-item lines="none">
                  <ion-icon slot="start" class="badge" size="large" :icon="ribbonOutline"></ion-icon>
                  <ion-text color="primary">
                    Welcome {{ profile.titleNameTh || profile.titleNameEn }}{{ profile.firstNameTh || profile.firstNameEn }}
                  </ion-text>
                </ion-item>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-card>
              <img :src="activity_records.length > 0 ? imageLogos[activity_records.slice(0, 4)[0].type] : 'https://source.unsplash.com/gJtDg6WfMlQ'">
              <ion-card-header>
                <ion-card-title>Your Recent Activities</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-text>Next level</ion-text>
                <ion-progress-bar value="0.0"></ion-progress-bar>
                <ion-list>
                  <ion-item lines="full" v-for="rec in activity_records.slice(0, 4)" :key="rec.id">
                    <ion-label>
                      {{ rec.type }}
                    </ion-label>
                    <ion-note slot="end">
                      {{ rec.estimatedCalories.toFixed(1) }} Cal.
                    </ion-note>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row v-for="ch in challenges" :key="ch.id">
          <ion-col>
            <ion-card>
              <img :src="ch.imageUrl !== '' ? ch.imageUrl : 'https://source.unsplash.com/gJtDg6WfMlQ'">
              <ion-card-header>
                <ion-card-title>{{ ch.title }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                {{ ch.pitch }}
                <ion-button v-if="profile.challenges.indexOf(ch.id) < 0"
                            @click="addChallenge(ch.id)">Join now</ion-button>
                <ion-button v-else
                            @click="$router.push({ name: 'ChallengeDetail', params: { recordId: ch.id}})">
                  Detail
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonIcon,
  IonButton,
  IonProgressBar,
  IonLabel,
  IonCardTitle,
  IonNote,
  IonText,
} from '@ionic/vue';
import {defineComponent} from 'vue';
import { ribbonOutline } from 'ionicons/icons';
import {collection, getDocs, query, where, orderBy, doc, updateDoc, addDoc, getDoc} from "firebase/firestore";
import {db} from "@/firebase";
import { mapState} from "vuex";

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonIcon,
    IonButton,
    IonProgressBar,
    IonLabel,
    IonCardTitle,
    IonNote,
    IonText,
  },
  setup() {
    return {
      ribbonOutline,
    }
  },
  computed: {
    ...mapState(['user', 'profile', 'activity_records', 'challenges', 'groups']),
  },
  // mapState is async operation, we need to watch for when the data is ready
  watch: {
    user: async function (newValue) {
      await this.loadGroups(newValue.userId)
      await this.loadChallenges()
      await this.loadActivities(newValue.userId)
    }
  },
  data () {
    return {
      authToken: null,
      urlQuery: null,
      imageLogos: {}
    }
  },
  async mounted() {
    let urlQuery = this.$route.query
    if (Object.keys(urlQuery).length !== 0) {
      this.setUpUser(urlQuery)
    } else {
      // this.$router.push({ name: 'Prohibition' })
      this.setUpUser({
        userId: 'mahidol-test',
        userName: 'mahidol-test',
        firstNameTh: 'ลิขิต',
        lastNameTh: 'ปรียานนท์',
        titleNameTh: 'ดร.',
        titleNameEn: 'Dr.',
        firstNameEn: 'Likit',
        lastNameEn: 'Preeyanon',
        userLogin: 'likit.pre@mahidol.ac.th',
        emails: 'likit.pre@mahidol.ac.th',
        facultyNameTh: 'คณะเทคนิคการแพทย์',
        facultyNameEn: 'FACULTY OF MEDICAL TECHNOLOGY',
        groupType: 'staff',
      })
    }
    await this.loadImageLogos()
  },
  methods: {
    async setUpUser(data) {
      let ref = collection(db, 'users')
      let q = query(ref, where('userId', '==', data.userId))
      let querySnapshot = await getDocs(q)
      let userData = {
        userId: data.userId,
        userName: data.userName
      }
      if (querySnapshot.empty) {
        await addDoc(ref, userData)
      }
      this.$store.commit('SET_USER', userData)
      let profileRef = collection(db, 'profiles')
      q = query(profileRef, where('userId', '==', data.userId))
      querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        data['challenges'] = []
        await addDoc(profileRef, data)
        this.$store.dispatch('updateProfile', data)
      } else {
        for (let d of querySnapshot.docs) {
          let docRef = doc(db, 'profiles', d.id)
          await updateDoc(docRef, data)
          let docSnapshot = await getDoc(docRef)
          this.$store.dispatch('updateProfile', docSnapshot.data())
        }
      }
    },
    async addChallenge(challengeId) {
      if (this.profile.challenges.indexOf(challengeId) < 0) {
        let ref = collection(db, 'profiles')
        let q = query(ref, where('userId', '==', this.user.userId))
        let querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          querySnapshot.forEach(d => {
            let docRef = doc(db, 'profiles', d.id)
            this.$store.dispatch('addUserChallenge', challengeId)
            updateDoc(docRef, { challenges: this.profile.challenges})
          })
        }
      }
    },
    async loadGroups (userId) {
      let ref = collection(db, 'userGroups')
      let q = query(ref, where("members", "array-contains", userId))
      let querySnapshot = await getDocs(q)
      querySnapshot.forEach(d => {
        let data = d.data()
        data.id = d.id
        this.$store.dispatch('addGroup', data)
        this.$store.dispatch('setUserGroup', data)
      })
    },
    async loadActivities(userId) {
      if (this.activity_records.length == 0) {
        let ref = collection(db, 'activity_records')
        let q = query(ref,
            where('userId', '==', userId),
            orderBy('startDateTime', 'desc'),
        )
        let querySnapshot = await getDocs(q)
        querySnapshot.forEach(d => {
          let data = d.data()
          data.id = d.id
          this.$store.dispatch('addActivity', data)
        })
      }
    },
    async loadChallenges () {
      for (const g of this.groups) {
        let ref = collection(db, 'challenges')
        let q = query(ref, where('groups', 'array-contains', g.id))
        let querySnapshot = await getDocs(q)
        querySnapshot.forEach(d => {
          let data = d.data()
          data.id = d.id
          this.$store.dispatch('addChallenge', data)
        })
      }
    },
    async loadImageLogos () {
      let ref = collection(db, 'activity_image_logos')
      let querySnapshot = await getDocs(ref)
      querySnapshot.forEach(d => {
        let data = d.data()
        this.imageLogos[data.type] = data.url
      })
    },
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.badge {
  font-size: 64px;
}

</style>
