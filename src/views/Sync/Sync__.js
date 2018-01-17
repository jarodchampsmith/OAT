import Vue from 'vue';
import moment from 'moment';
import {Toast, Events, Platform, Utils} from 'quasar';

export default {
  name: 'sync',
  components: {},
  data () {
    return {
      posters: [
        'answers',
        'assets',
        'attachments',
        'inspections',
        'photos',
        'meters',
        'transports'

      ],
      syncMessage: 'Syncing with OATS website...',
      syncMessages: [],
      pendingUpdates: [],
      answerTime: '',
      completedUpates : [],
    }
  },

  watch : {
    syncMessage: function(newMessage) {
      this.syncMessages.push(newMessage);
    },
  },

  mounted() {
    let vm = this;
    Events.$off('inspection:complete');
    Events.$on('inspection:complete', function (inspection) {
      console.log('Firing inspection complete sync action.');
      if (vm.$store.getters.currentUser.ID && vm.$store.getters.isOnline) {
        vm.postSyncAction('INSPECTION', inspection.id, 'COMPLETE');
      }
    });
    /* Perform offline sync if user is not online */
    setTimeout ( function () {
      try{
        if ( !vm.$store.getters.isOnline ) {
          window.pdb.get('oatsdb').then(function (doc) {
            vm.$store.replaceState(doc.state);
            vm.syncMessage = `Completed offline sync.`;
            Events.$emit('sync:complete');
            Toast.create.positive({
              html: `You are currently working offline, please sync all changes next time you are online.`,
              timeout: 3000
            });
            vm.$router.push('dashboard');
          }).catch(function (err) {
            console.log(err);
            Events.$emit('sync:error');
            Toast.create.negative({
              html: `There was an error syncing the application, you may need to connect to the internet and perform a sync.`,
              timeout: 3000
            });
          });
        } else {
          /* Skip sync on first import */
            if (vm.$store.getters.importStatus === 'firstImport'){
              vm.$router.push('dashboard');
              Events.$emit('sync:complete');
              vm.$store.commit('setImportStatus', 'importComplete');
              return;
            } else {
              /* Check for and apply any sync actions */
              vm.syncMessages.push(`Checking for new sync actions...`);
              vm.checkSyncActions();
              vm.syncMessages.push(`Checking for changes...`);
              console.log('checking for changes');
              vm.posters.forEach((name) => {
                switch (name) {
                  case 'answers', 'photos':
                    vm.answerTime = true;
                    break;
                  default:
                    vm.answerTime = false;
                    break;
                }
                vm.puts(name, vm.answerTime);
              });
            }
        }
      } catch (error) {

      }
    },1000);

  },

  methods : {

    /**
     * Send a new syncAction to the API
     * @param objectName
     * @param objectId
     * @param action
     */
    postSyncAction (objectName, objectId, action) {
      let vm = this;
      let request = {
        syncAction: {
          objectName: objectName,
          objectId: objectId,
          action: action
        }
      };
    },

    /**
     * Check for and perform any sync actions as reported by the API
     * Actions: COMPLETE, DELETE, RESET
     * API Returns: {objectId, action, objectName}
     */
    checkSyncActions () {
      let queryTime = this.$store.getters.lastSync + 60 * 60 * 6;
      let vm = this;
      Vue.axios.get(this.$store.getters.api.url + 'sync-actions', {
        params: {
          where: `createdAt>FROM_UNIXTIME(${queryTime})`
        }
      }).then(function (response) {
        if (response.data && response.data.DATA && response.data.DATA.length > 0) {
          vm.applySyncActions(response.data.DATA);
        }
      }).catch(function (error) {
          console.log(error);
          if (!error.response) {
            return;
          }
          window._oatsVue.$root.logError('apiError', 'error', error.response.status,
            /* Error data */
            {
              message: error.response.statusText
            },
            /* Meta data */
            {
              url: error.config.url,
              itemType: db.name
            }
          );
        });
    },
    /**
     * Apply any sync actions fetched from the API.
     * @param syncActions
     */
    applySyncActions(syncActions) {
      console.log(`Applying ${syncActions.length} sync actions`);

      /* Override For Testing
      let tmpSyncActions = [
        {
         "objectID": '100,1,8',
         "action": "RESET",
         "objectName": "ANSWER"
        }
      ];
       */
      syncActions.forEach((action) => {
        switch (action.action) {
          case 'DELETE':
          case 'COMPLETE':
            this.$store.dispatch('removeItem', action);
            break;
          case 'RESET':
            this.$store.dispatch('resetItem', action);
            break;
        }
      });
    },

    puts (name, answerTime = NULL) {
      let vm = this;
      let db = this.$store.getters[name];
      let added_arr = [];
      let updated_arr = [];
      let added = [];
      let updated = [];
      let res_arr = [];
      let dbSyncNiceDate = moment.unix(db.synced).utc().format('MMMM, DD YYYY HH:mm:ss');
      let itemsLength = db.items.length;
      vm.pendingUpdates[name] = db;
      for ( let i = 0 ; i < itemsLength; i ++) {
        if (db.items[i].hasOwnProperty('appGeneratedID')) {
          if ( db.items[i].appGeneratedID.length === 36 ) {
            added.push(db.items[i]);
          }
        }
        if (moment(db.items[i].createdAt).utc().isAfter(dbSyncNiceDate) || db.items[i].created === false) {
          console.log(` ${i} (Index of ${name})  ${db.items[i].createdAt} is after ${dbSyncNiceDate}`);
          added.push(db.items[i]);
        } else if (moment(db.items[i].updatedAt).utc().isAfter(dbSyncNiceDate)) {
          updated.push(db.items[i]);
        }
      }
      // console.log(added);
      // added.forEach( (item) => {
      //   let payloadName = name.substr(0, name.length - 1);
      //   console.log(payloadName);
      //   if(payloadName == "answer"){
      //     let opts = {
      //       objectName: 'ANSWER',
      //       objectID: `${item.inspectionid}, ${item.categoryid}, ${item.questionid}`
      //     };
      //     vm.$store.dispatch('removeItem', opts);
      //   } else if (payloadName === "photo")  {
      //     let opts = {
      //       appGeneratedID: item.appGeneratedID,
      //     };
      //     vm.$store.dispatch('removePhoto', opts);
      //   } else {
      //     let opts = {
      //       objectName: name.substr(0, name.length - 1).toUpperCase(),
      //       objectID: item.id
      //     };
      //     vm.$store.dispatch('removeItem', opts);
      //   }
      // });
      added.forEach( (item) => {
        let payloadName = name.substr(0, name.length - 1);
        let params = {
          name: name,
          payload: {}
        };
        params.payload[payloadName] = JSON.parse(JSON.stringify(item));

        vm.$store.dispatch('putItem', params).then( (response) => {
          console.log(response);
        }).catch( (error) => {
          console.log(error);
        });
      });
      updated.forEach( (item) => {
        
      });
      // added[name] = added_arr;
      // updated[name] = updated_arr;

      // vm.pendingUpdates[name] = added;
      // vm.pendingUpdates[name] = updated;
    }

  }
};
