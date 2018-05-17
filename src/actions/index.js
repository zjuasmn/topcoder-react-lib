/**
 * @module actions
 * @desc Collection of Redux actions that allow to interact with Topcoder APIs.
 * 
 * Example:
 * ```js
 * import { actions } from 'topcoder-react-lib';
 *
 * const setTcTokenV3Action = actions.auth.setTcTokenV3('DUMMY_TOKEN_VALUE');
 * ```
 *
 * Documentation of actions only covers purpose and arguments of the actions. To
 * learn about data location in the Redux store, and overal logic behind these
 * actions, look into documentation of corresponding reducers.
 *
 *  - [actions](#module_actions)
 *    - [.auth](actions.auth.md) - Topcoder authentication system;
 *    - [.challenges](actions.challenge.md) - Topcoder challenge APIs;
 *    - [.direct](actions.direct.md) - Topcoder Direct API: access to projects,
 *      billing accounts, copilot operations, etc.;
 *    - [.errors](actions.errors.md) - Standard error handling (will be moved
 *      to `topcoder-react-utils` soon);
 *    - [.groups](actions.groups.md) - Actions related to user groups;
 *    - [.member-tasks](actions.member-tasks.md) - Management of member tasks
 *      and payments;
 *    - [.members](actions.members.md) - Member data (achievements, finances,
 *      stats);
 *    - [.profile](actions.profile.md) - Actions related to member profiles,
 *      somewhat duplicating `members` actions, these sets of actions will be
 *      merged later;
 *    - [.reviewOpportunity](actions.reviewOpportunity.md) - Loading of
 *      challenge review opportunities, applications to reviewer position;
 *    - [.smp](actions.smp.md) - Management of user's submissions;
 *    - [.stats](actions.stats.md) - Topcoder stats (at the moment only related
 *      to Topcoder communities);
 *    - [.terms](actions.terms.md) - Operations with Topcoder *Terms of Use*.
 */

import authActions from './auth';
import smpActions from './smp';
import statsActions from './stats';
import termsActions from './terms';
import directActions from './direct';
import groupActions from './groups';
import errorActions from './errors';
import challengeActions from './challenge';
import profileActions from './profile';
import memberActions from './members';
import memberTaskActions from './member-tasks';
import reviewOpportunityActions from './reviewOpportunity';

export const actions = {
  auth: authActions.auth,
  smp: smpActions.smp,
  challenge: challengeActions.challenge,
  terms: termsActions.terms,
  stats: statsActions.stats,
  direct: directActions.direct,
  groups: groupActions.groups,
  errors: errorActions.errors,
  profile: profileActions.profile,
  members: memberActions.members,
  memberTasks: memberTaskActions.memberTasks,
  reviewOpportunity: reviewOpportunityActions.reviewOpportunity,
};

export default undefined;
