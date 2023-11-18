<template >
    <div>
        <v-dialog persistent v-model = "loadings"  width="300" hide-overlay>
            <v-card color="primary" dark >
            <v-card-text>
                <!-- Please stand by -->
                <v-progress-circular
                indeterminate
                color="white"
                style="margin-left: 70px;"
                :size="120"
                :width="20"
                class="mt-4"
                >
                </v-progress-circular><br/>
                <span style="margin-left: 100px; padding-top: 70px;">Please wait...</span>
            </v-card-text>
            </v-card>
        </v-dialog>        
    </div>
</template>
<script>
export default {
  name: "LoadingPage",
  props:['loadings'],
  data:()=>({
  }),
  methods: {

    //    getAllReceivedData(){
    //      this.axios.get(`${this.getUrl}/getAllReceivedData`).then(res=>{
    //           if(res.data){      
    //             res.data.filter(r=>{
    //                     if(r._id != "_design/jov"){
    //                         if(r.DateReceived == moment().format('YYYY-MM-DD')){
    //                             this.AllReceived.push(r) 
    //                         }else{
    //                             return false
    //                         }               
    //                     }else{
    //                         return false
    //                     }
    //                 })  
                    
    //           }else{
    //               return false
    //           }
    //       })
    //     },





    //    OutputTodayPrint(){
    //          this.axios.get(`${this.getUrl}/getAllReceivedData`).then(res=>{
    //             if(res.data){
    //                 res.data.filter(r=>{
    //                 if(r._id != "_design/jov"){
    //                     if(r.PrintingDate == moment().format('YYYY-MM-DD') || r.SendingDate == moment().format('YYYY-MM-DD')){
    //                         console.log(r,'output')
    //                         this.OutputToday.push(r)
    //                     }else{
    //                         return false
    //                     }
    //                 }else{
    //                     return false
    //                 }

    //                 })
                     
    //             }else{
    //                 return false
    //             }
    //         })
    //     },     

    //     Cancel(item){
    //         item.Status = 'Cancel'
    //         item.PrintingDate = moment().format('YYYY-MM-DD')
    //        this.axios.post(`${this.getUrl}/insertDatabase`,{
    //                 Database: item
    //             })
    //        setTimeout(() => {
    //        this.loadDatePrinting()
    //   }, 200);
    //     },




  }, 
}
</script>
<style >
    
</style>