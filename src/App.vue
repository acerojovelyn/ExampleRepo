<template>
  <v-app >
    <v-navigation-drawer
      v-if="userInfo && userInfo.AccessRights == 'User'"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      :mini-variant="drawer" 
     mobile-breakpoint="300" 
     >
      <v-list-item link :to="item.to"  v-for="(item, i) in User"
          :key="i">
        <v-list-item-action>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" color="#4F687F">{{item.icon}}</v-icon>
            </template>
            <span>{{item.title}}</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{item.title}}</v-list-item-title>
        </v-list-item-content>
      
      </v-list-item>
          <v-divider />
    </v-navigation-drawer> 
    <v-navigation-drawer
      v-if="userInfo && userInfo.AccessRights == 'Admin'"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      :mini-variant="drawer"
     mobile-breakpoint="300"
     >
      <v-list-item link :to="item.to"  v-for="(item, i) in Admin"
          :key="i">
        <v-list-item-action>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" color="#4F687F">{{item.icon}}</v-icon>
            </template>
            <span>{{item.title}}</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{item.title}}</v-list-item-title>
        </v-list-item-content>
      
      </v-list-item>
          <v-divider />
    </v-navigation-drawer>

    <v-app-bar app
 v-if="userInfo"
    text
    height="53px"
    class="elevation-1 "  
    fixed
    dense
    id="inspire"  
    :clipped-left="$vuetify.breakpoint.lgAndUp" dark flat color="#658EA9">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title class="mainbarTitle myPointer" @click.stop="drawer = !drawer"  style="font-family: impact;
                                    font-size: 34px; 
                                    color: white;
                                    text-shadow: 2px 2px 4px #000000;
                                    "><v-icon large dark class="mr-n1">mdi-database-export-outline</v-icon><b class="mt-5">{{SystemName}}</b></v-toolbar-title>
      <v-spacer />
       <!-- <b style="font-size:15px;font-family: Arial Narrow Bold, sans-serif;" class="mt-2">{{userInfo.EmployeeName}}</b> -->

            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">       
            <v-btn sm text fab v-bind="attrs" v-on="on">
              <v-avatar  size="43" >   
                <!-- <img  width="45%" :src="`http://hrdapps48:3001/ftp/employee_pictures/0${userInfo.EmployeeCode}.jpg`"/>  -->
                 <img  width="45%" :src="`http://adminsql1/photos/${userInfo.EmployeeCode}.jpg`"/> 
              </v-avatar>
            </v-btn>   
              </template>
              <span>
                 <center>
                  ({{userInfo.EmployeeCode}}) 
                  {{userInfo.EmployeeName}}
              </center>
              </span>
               </v-tooltip>       
 

           <v-divider vertical/>
       <v-tooltip bottom>
         <template v-slot:activator="{ on, attrs }">
           <v-btn text icon @click="logOut()">
             <v-icon  color="white" medium v-bind="attrs" v-on="on"  >mdi-arrow-right-bold-circle</v-icon>
           </v-btn>   
         </template>
         <span>Log Out</span>
       </v-tooltip>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Swal from "sweetalert2"
export default {
  name: "App",

  components: {},

  data: () => ({
    drawer: true,
    User: [
    //  {
    //     title: 'Home',
    //     icon:'mdi-home',
    //     to: '/'
    //   },
      // {
      //   title: 'Tekkin Printing',
      //   icon:'mdi-printer',
      //   to: '/tekkin_printing',
      // },
      {
        title: 'Tekkin Sending',
        icon:'mdi-email-send',
        to: '/tekkin_sending'
      },
      {
        title: 'Finished Plans',
        icon:'mdi-calendar',
        to: '/tekkin_finished'
      },
      {
        title: 'Cancelled Plans',
        icon:'mdi-file-cancel-outline',
        to: '/tekkin_cancelled'
      },
    
    ],
    Admin: [
    //  {
    //     title: 'Home',
    //     icon:'mdi-home',
    //     to: '/'
    //   },
      // {
      //   title: 'Tekkin Printing',
      //   icon:'mdi-printer',
      //   to: '/tekkin_printing'
      // },
      {
        title: 'Tekkin Sending',
        icon:'mdi-email-send',
        to: '/tekkin_sending'
      },
      {
        title: 'Finished Plans',
        icon:'mdi-calendar',
        to: '/tekkin_finished'
      },
      {
        title: 'Cancelled Plans',
        icon:'mdi-file-cancel-outline',
        to: '/tekkin_cancelled'
      },
       {
        title: 'Formula',
        icon:'mdi-format-header-equal',
        to: '/tekkin_formula'
      },
      {
        title: 'Subcon Email',
        icon:'mdi-email-plus-outline',
        to: '/tekkin_SubconEmail'
      },
      {
        title: 'Accounts',
        icon:'mdi-account-edit-outline',
        to: '/tekkin_Accounts'
      },
    ],
    //
  }),
  methods: {
    logOut(){
       Swal.fire({
            position: 'center-end',
            icon: 'success',
            toast: true,
            title: 'You are now logout! Thank you',
            showConfirmButton: false,
            timer: 1500
      })
        this.$store.commit('STORE_USERINFO',null)
        this.$router.push('/login')     
    }

  },
  // created() {
  //   console.log(this.getUrl,this.api)
  // },
};
</script>
<style scoped>
div.v-list-item__title {
  align-self: center;
  font-size: 13px;
}
</style>