/**
 * @module "actions.challenge"
 * @desc Actions related to Topcoder challenges APIs.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getChallengesService } from '../services/challenges';
import { getApiV2 } from '../services/api';

/**
 * @static
 * @desc Creates an action that drops from Redux store all checkpoints loaded
 *  before.
 * @return {Action}
 */
function dropCheckpoints() {}

/**
 * @static
 * @desc Creates an action that drops from Redux store all challenge results
 *  loaded before.
 * @return {Action}
 */
function dropResults() {}

/**
 * @static
 * @desc Creates an action that signals beginning of challenge details loading.
 * @param {Number|String} challengeId Challenge ID
 * @return {Action}
 */
function getDetailsInit(challengeId) {
  return _.toString(challengeId);
}

/**
 * @static
 * @desc Creates an action that loads challenge details.
 * @param {Number|String} challengeId Challenge ID.
 * @param {String} tokenV3 Topcoder v3 auth token.
 * @param {String} tokenV2 Topcoder v2 auth token.
 * @return {Action}
 */
function getDetailsDone(challengeId, tokenV3, tokenV2) {
  const service = getChallengesService(tokenV3, tokenV2);
  const v3Promise = service.getChallengeDetails(challengeId);
  return v3Promise;
}

/**
 * @static
 * @desc Creates an action that signals beginning of user submissions loading.
 * @param {String} challengeId Challenge ID.
 * @return {Action}
 */
function getSubmissionsInit(challengeId) {
  /* As a safeguard, we enforce challengeId to be string (in case somebody
   * passes in a number, by mistake). */
  return _.toString(challengeId);
}

/**
 * @static
 * @desc Creates an action that loads user's submissions to the specified
 * challenge.
 * @param {String} challengeId Challenge ID.
 * @param {String} tokenV2  Topcoder auth token v2.
 * @return {Action}
 */
function getSubmissionsDone(challengeId, tokenV2) {
  return getApiV2(tokenV2)
    .fetch(`/challenges/submissions/${challengeId}/mySubmissions`)
    .then(response => response.json())
    .then(response => ({
      challengeId: _.toString(challengeId),
      submissions: response.submissions,
    }))
    .catch((error) => {
      const err = { challengeId: _.toString(challengeId), error };
      throw err;
    });
}

/**
 * @static
 * @desc Creates an action that signals beginning of registration for a
 * challenge.
 * @return {Action}
 */
function registerInit() {
}

/**
 * @static
 * @desc Creates an action that registers user for a challenge.
 * @param {Object} auth An object that holds auth tokens. You can directly pass
 *  here the `auth` segment of Redux store.
 * @param [auth.tokenV2]{String} Topcoder auth token v2.
 * @param [auth.tokenV3]{String} Topcoder auth token v3.
 * @param {String} challengeId Challenge ID.
 * @return {Action}
 */
function registerDone(auth, challengeId) {
  return getChallengesService(auth.tokenV3)
    .register(challengeId)
    /* As a part of registration flow we silently update challenge details,
     * reusing for this purpose the corresponding action handler. */
    .then(() => getDetailsDone(challengeId, auth.tokenV3, auth.tokenV2));
}

/**
 * @static
 * @desc Creates an action that signals beginning of user unregistration from a
 *  challenge.
 * @return {Action}
 */
function unregisterInit() {}

/**
 * @static
 * @desc Creates an action that unregisters user from a challenge.
 * @param {Object} auth Object that holds Topcoder auth tokens.
 * @param {String} [auth.tokenV2] v2 token.
 * @param {String} [auth.tokenV3] v3 token.
 * @param {String} challengeId Challenge ID.
 * @return {Action}
 */
function unregisterDone(auth, challengeId) {
  return getChallengesService(auth.tokenV3)
    .unregister(challengeId)
    /* As a part of unregistration flow we silently update challenge details,
     * reusing for this purpose the corresponding action handler. */
    .then(() => getDetailsDone(challengeId, auth.tokenV3, auth.tokenV2));
}

/**
 * @static
 * @desc Creates an action that signals beginning of challenge results loading.
 * @param {Number|String} challengeId Challenge ID
 * @return {Action}
 */
function loadResultsInit(challengeId) {
  return _.toString(challengeId);
}

/**
 * @static
 * @desc Creates an action that loads challenge results.
 * @param {Object} auth Object that holds Topcoder auth tokens.
 * @param {String} [auth.tokenV2] v2 token.
 * @param {String} [auth.tokenV3] v3 token.
 * @param {Number|String} challengeId Challenge ID. Should match the one passed
 *  in the previous {@link module:actions.challenge.loadResultsInit} call.
 * @param {String} type Challenge type.
 * @return {Action}
 */
function loadResultsDone(auth, challengeId, type) {
  return getApiV2(auth.tokenV2)
    .fetch(`/${type}/challenges/result/${challengeId}`)
    .then(response => response.json())
    .then(response => ({
      challengeId: _.toString(challengeId),
      results: response.results,
    }));
}

/**
 * @static
 * @desc Creates an action that signals beginning of challenge checkpoints data
 *  loading.
 * @return {Action}
 */
function fetchCheckpointsInit() {}

/**
 * @static
 * @desc Creates an action that loads challenge checkpoints data.
 * @param {String} tokenV2 Topcoder v2 auth token.
 * @param {String} challengeId Challenge ID.
 */
function fetchCheckpointsDone(tokenV2, challengeId) {
  const endpoint = `/design/challenges/checkpoint/${challengeId}`;
  return getApiV2(tokenV2).fetch(endpoint)
    .then((response) => {
      if (response.status !== 200) {
        throw response.status;
      } else {
        return response.json();
      }
    })
    .then((response) => {
      // Expanded key is used for UI expand/collapse.
      response.checkpointResults.forEach((checkpoint, index) => {
        response.checkpointResults[index].expanded = false;
      });
      return {
        challengeId: Number(challengeId),
        checkpoints: response,
      };
    })
    .catch(error => ({
      error,
      challengeId: Number(challengeId),
    }));
}

/**
 * @static
 * @desc Creates an action that Toggles checkpoint details panel in the Topcoder
 *  Submission Management Page.
 * @todo This is UI action relevant to a specific page in specific app. Must be
 *  moved back to Community App.
 * @param {Number} id Checkpoint ID.
 * @param {Boolean} open Target state: `true` to expand, `false` to collapse the
 *  details.
 * @return {Action}
 */
function toggleCheckpointFeedback(id, open) {
  return { id, open };
}

/**
 * @static
 * @desc Creates an action that signals beginning of challenge details update.
 * @todo No idea, why we have this action. This functionality should be covered
 *  by {@link module:actions.challenge.getDetailsInit} and
 *  {@link module:actions.challenge.getDetailsDone}. We need to refactor this.
 * @param {String} uuid UUID of the operation (the same should be passed into
 *  the corresponding {@link module:actions.challenge.updateChallengeDone}).
 * @return {Action}
 */
function updateChallengeInit(uuid) {
  return uuid;
}

/**
 * @static
 * @desc Creates an action that updates challenge details.
 * @todo No idea, why we have this action. This functionality should be covered
 *  by {@link module:actions.challenge.getDetailsInit} and
 *  {@link module:actions.challenge.getDetailsDone}. We need to refactor this.
 * @param {String} uuid Operation UUID. Should match the one passed into the
 *  previous {@link module:actions.challenge.updateChallengeInit} call.
 * @param {Object} challenge Challenge data.
 * @param {String} tokenV3 Topcoder v3 auth token.
 * @return {Action}
 */
function updateChallengeDone(uuid, challenge, tokenV3) {
  return getChallengesService(tokenV3).updateChallenge(challenge)
    .then(res => ({ uuid, res }));
}

export default createActions({
  CHALLENGE: {
    DROP_CHECKPOINTS: dropCheckpoints,
    DROP_RESULTS: dropResults,
    FETCH_CHECKPOINTS_INIT: fetchCheckpointsInit,
    FETCH_CHECKPOINTS_DONE: fetchCheckpointsDone,
    GET_DETAILS_INIT: getDetailsInit,
    GET_DETAILS_DONE: getDetailsDone,
    GET_SUBMISSIONS_INIT: getSubmissionsInit,
    GET_SUBMISSIONS_DONE: getSubmissionsDone,
    LOAD_RESULTS_INIT: loadResultsInit,
    LOAD_RESULTS_DONE: loadResultsDone,
    REGISTER_INIT: registerInit,
    REGISTER_DONE: registerDone,
    TOGGLE_CHECKPOINT_FEEDBACK: toggleCheckpointFeedback,
    UNREGISTER_INIT: unregisterInit,
    UNREGISTER_DONE: unregisterDone,
    UPDATE_CHALLENGE_INIT: updateChallengeInit,
    UPDATE_CHALLENGE_DONE: updateChallengeDone,
  },
});
