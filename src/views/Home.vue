<template>
  <div >
    <v-container>
           

          <!-- <v-row>
            <v-col cols="4">
          <v-card style="background-image: linear-gradient(to right top, #84b1f6, #94c1f6, #aad1f5, #c3dff4, #dfecf4);"  class="selectDashboard" >   
            <v-card-text>         
              <span style="font-family:Impact;font-size:25px;font-style:bold;color:white;text-shadow: 2px 2px 4px #000000;">Received Plans Today : </span>
              <br><br><br><br>
              <span style="font-size:150px;color:#658EA9;margin-left:150px;" ><b>{{ReceivedToday.length}}</b></span>
              <br><br><br>
            </v-card-text>
          </v-card>
          </v-col>
        
          <v-col cols="4">
          <v-card style="background-image: linear-gradient(to right top, #cce0e5, #d1e3e9, #d5e6ed, #dae9f0, #dfecf4);"  class="selectDashboard" color="#D5CABD">   
            <v-card-text>         
              <span style="font-family:Impact;font-size:25px;font-style:bold;color:white;text-shadow: 2px 2px 4px #000000;">Total Balance : </span>
              <br><br><br><br>
              <span style="font-size:150px;color:#658EA9;margin-left:150px;" ><b></b></span>
              <br><br><br>
            </v-card-text>
          </v-card> 
           </v-col>
          <v-col cols="4">
          <v-card style="background-image: linear-gradient(to right top, #99bccf, #abc8d8, #bcd4e1, #cee0eb, #dfecf4);"  class="selectDashboard" color="#FEFEDF">   
            <v-card-text>         
              <span style="font-family:Impact;font-size:25px;font-style:bold;color:white;text-shadow: 2px 2px 4px #000000;">Output Today : </span>
              <br><br><br><br>
              <span style="font-size:150px;color:#658EA9;margin-left:150px;" ><b></b></span>
              <br><br><br>
            </v-card-text>
          </v-card>
           </v-col>           
          </v-row>  -->
          
    
      </v-container>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
// import moment from 'moment'
export default {
  name: 'Home',
  components: {
    
  },
  data(){
    return {
      ReceivedToday: [],
      date : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    }
  },
  created(){
    this.loadDashboard()
  },
  methods: {
   async loadDashboard(){
           await this.axios.get(`${this.getUrl}/getReceivedData/` + this.date).then(res=>{
                if(res.data){
                this.ReceivedToday = res.data 
                this.ReceivedToday.filter(r=>{
                this.axios.get(`${this.getUrl}/getFormulaData`).then(res2=>{
                    if(res2.data){
                        res2.data.filter(r1=>{
                        if(r.SubconCode == r1.SubconCode && r.BranchCode == r1.BranchCode){
                            r.Subcon = r1.Subcon
                        }
                        if(r1.BranchCode == '' && r.SubconCode == r1.SubconCode){
                            r.Subcon = r1.Subcon
                        } 
                     })
                    }                  
                 })  
                })   
               }
          
            })
      // console.log(this.printreceived)
    //  await this.printreceived.filter(r=>{
    //     if(r.DateReceived == moment().format('YYYY-MM-DD')){
    //       this.ReceivedToday.push(r)
    //     }
    //   })
    },
  },
}
</script>
