const functions = require('firebase-functions');

exports.stopBlind = functions.database.ref('/persianas/{blindID}')
    .onUpdate((change, context) => {
        return new Promise(
            (resolve, reject) => {
                setTimeout(
                    () => change.after.ref.set(0).then(resolve, reject)
                    , 20000
                )
            }
        )
    });