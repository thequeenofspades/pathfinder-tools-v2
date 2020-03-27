import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

exports.purgeSessions = functions.firestore
	.document('sessions/{sessionId}')
	.onCreate((snap, context) => {
		let cutoff = Date.now();
		cutoff -= 30 * 24 * 60 * 60 * 1000;
		return admin.firestore().collection('sessions')
			.where('timestamp', '<', cutoff)
			.get()
			.then(qs => {
				qs.forEach(doc => {
					return admin.firestore().collection('sessions')
						.doc(doc.id)
						.delete();
				});
			}).catch(err => console.log(err));
	});

exports.purgeStorage = functions.firestore
	.document('sessions/{sessionId}')
	.onDelete((snap, context) => {
		const { sessionId } = context.params;
		const bucket = admin.storage().bucket();
		return bucket.deleteFiles({
			force: true,
			prefix: `sessions/${sessionId}`
		});
	});