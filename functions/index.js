const functions = require('firebase-functions');

exports.setData = functions.database.ref('/users/{uid}/{fid}')
    .onWrite(async (change, context) => {
        const isAdmin = await change.after.ref.root.child('/admins/'+context.params.uid).once('value')
        if(isAdmin.exists())
        {
           const snapshot = await change.after.ref.root.child('/mapping/'+context.params.fid+"/device").once('value')
           if(snapshot.exists())
           {
              const did = snapshot.val()
              console.log(did)
              return change.after.ref.root.child('/devices/'+did+'/value').set(change.after.val())
           }
        }
    });

