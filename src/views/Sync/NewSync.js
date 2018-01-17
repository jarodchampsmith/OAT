/**
 I have limited time to go over this so this is a rough draft of the proposed new sync operation.
**/

/**
 Important: The order of sync operations is extremely important. The necessary order is as follows:

 Assets
 	-> Inspections
		-> Answers
		-> Photos
 	-> Vessels
		-> Meters (Meters will soon be attached to assets which means they will be able to move up on level in the sync).
 	-> Attachments (Hoses)
 	-> Transports

 If you're ever in doubt of the order that needs to be preserved just look at the fields for each item in index.js (you'll see for example inspections have an assetid field which means the assetid needs to be synced so it can receive a real ID before the inspection is synced).

**/

/**
 * Special considerations for answers:
 *
 * 1. Answers will not return an ID when POSTED
 * 2. Answers need to be serialized before being POSTED
 * 3. Answers need to be unserialized AFTER being posted (only if using the original answer object as the object will be passed by reference)
 * 4. Answers need to be unserialized AFTER being fetched (GET)
 */

/**
 General Overview:

 The sync should be ran the following order:

 -> Check and apply sync actions
 -> Create all items
 -> Update all items
 -> Fetch any new items
 -> Sync complete

 Any newly created assets need to sync first. The asset will only have an appGeneratedID locally before it is synced and created via the API. The API will return a new ID for the asset.
 The asset should then update its local id with the new id and check for any other items that were using the appGeneratedID to referene the asset and update them with the new ID.

 The same logic applies to all items in the order referenced above. Assets will update their ID and all related item ID's. Then Inspections will update their ID's and and all related items. So on and so forth.

 The basic relations are as follows:

 Assets
 	- Have one or more vessels
 	- Have one or more attachments
 	- Have one or more transports
 	- Have one or more inspections
 	- Have one or more photos

 Vessels
 	- Have one or more meters

 Inspections
 	- Have one or more questions
 	- Have one or more answers
 	- Have one or more photos
    - Belong to an asset


 ** Photos can belong to an asset or an inspection, they have an inspectionid and an assetid

**/

/** -------------- START NEW SYNC LOGIC -------------- **/

/* Check for new sync actions from the API */

	/* If new sync actions have been found they should be applied immediately before the rest of the sync  */ √

	/* If no sync items are found continue to the next step (POST) */  √

	/* Note: this could be a good place to potentially see if the the connection is resulting in a high latency
			 and if so, suggest aborting the sync until they are on a better connection
	*/


/* Loop over all items in the local database to see if they need to be updated or created, newly created items should always take precedence */
/* Store all the items that need to be created in a multi dimensional array which should have keys
   for each item type as well as added/updated keys (assets, inspections, answers etc.)

   *** For convenience, this array will be referenced to as "pendingUpdates" from here forward.
 */

	/* If an item has a createdAt field > dbSyncTime it needs to be created */ √

	/* If an item has a property [created] which is equal to false then it needs to be created (newly created answers will have this property set) */ √

	/* If an item has an id which is an appGeneratedID (36 characters long), then it needs to be created */ √

	/* If an item has an updatedAt field > dbSyncTime it needs to be updated */ √

/* End loop over all items */


/* For each item that has to be ADDED/CREATED, from the "pendingUpdates" array, following the necessary order of precedence */

	/* Post the new item to the API */√

	/* If the POST was successful */

		/* Keep track of successfuly posted items in a 'completedUpates' array */

		/* Retrieve the new ID returned by the API */

		/* Update the LOCAL item with the new ID */

		/* Look up all items that were using the items appGeneratedID as their foreign key -- **this could be broken out into it's own function */

			/* Update all of the items that were found in the lookup, setting the foreigin key to the newly returned ID */

			/* For every item that was updated, check to see if its in the array of "pendingUpdates", if it is not found then add it to the array */

		/* End look up related items */

		/* Update the sync progress */

	/* If the POST was NOT successful */

		/* Keep track of unsuccessful items in a 'failedUpdates' array */

		/* Record the error */

		/* Update the sync progress */

/* End foreach item to be added */

/* For each item that has to be UPDATED, from the "pendingUpdates" array, following the necessary order of precedence for convenience */

	/* Double check that the item does not have any appGeneratedID's in any of its foreign key fields */

	/*** We could also abort posting updates if any of the POSTS failed, aborting the sync earlier ***/

	/* If there are appGeneratedID's, we can exit early following the unsucessful flow */

		/* If an appGeneratedID is found this likely means that the parent object failed to POST successfully */

	/* PUT the new item to the API */

	/* If the PUT was successful */

		/* Keep track of successfuly put items in a 'completedUpates' array */

		/* Unserialize the item if necessary (answers) */

		/* Update the sync progress */

	/* If the POST was NOT successful */

		/* Keep track of unsuccessful items in a 'failedUpdates' array */

		/* Record the error */

		/* Update the sync progress */

/* End foreach item to be UPDATED */

/* Foreach item type in the 'pendingUpdates' array */

	/* Check to see if there were any 'failedUpdates' for this item type */

	/* If there were ANY failed updates log the new errors including DETAILED item and meta information to Impeller then update the local dbSyncTime for this item type */

	/* If there were NO failed updates we can update the local dbSyncTime for this item type as all creations & updates were successful */

/* End foreach item */

/* For each itemType */

	/* Perform GETS, updating all local items in the db that match */
	/* GETS can be performed in parallel, 3 threads seems to be the most performant */
	/* The logic for matching local items is already solid */
	/* Answers need to be unserialized when fetched via a GET, specifically the answer.answer and answer.defectOutcome */
	/* Catch all errors on GETS and report to impeller */
		/* Record all failed GETS in 'failedGets' array */
	/* GETS are not as critical as the posts, but they can result in missing data if any of the gets fail */

	/* I'd like to elaborate on GETS but I'm running out of time :), overall the GETS seem pretty solid so it can likely be refactored without too many changes */

/* End foreach itemType */

/* When all GETS are complete and if there are no items in the 'failedUpdates' array */

	/* The sync is complete */
	/* Update the progress */
	/* Notify the user */
	/* Redirect to the dasboard */
	/* Fire sync complete event */
	/* Rejoice!! */

/* If there ARE 1 or more items in the failedUpdates array */
	/* Send a customized error detailing the # of failures, sync time, user id etc. to Impeller */
	/* List the items that failed to sync on the sync dashboard (grouping like items toogether) */
	/* Notify the user */
	/* Suggest retrying the sync [on a better connection?] */
	/* Offer a 'debug' opption which allows the user to view and report on the raw data that failed */
	/* Potentially alter the raw data with an override of sorts so we can always fix sync issues if need be? */


/* If there are failures in the 'failedGets' array */

	/* Notify the user that they should try syncing again to fetch missing items (listing the itemTypes) */
