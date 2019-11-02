import UserHelper from '../test/routes/helpers/user.helpers';
import AdminHelper from '../test/routes/helpers/admin.helpers';
import OrganizationHelper from '../test/routes/helpers/organization.helpers';
import GameHelper from '../test/routes/helpers/game.helpers';
import DonationHelper from '../test/routes/helpers/donation.helpers';


const popdb = async () => {
  let users = [];
  let organizations = [];
  let games = [];

  const NUM_USERS = 200;
  const NUM_ADMINS = 20;
  const NUM_ORGANIZATIONS = 30;
  const NUM_ACTIVE_GAMES = 20;
  const NUM_UPCOMING_GAMES = 40;
  const NUM_FINISHED_GAMES = 20;
  const NUM_DONATIONS = 400;

  AdminHelper.setupAdmins(NUM_ADMINS)
    .then(() => UserHelper.setupUsers(NUM_USERS))
    .then((createdUsers) => users = createdUsers)
    .then(() => OrganizationHelper.setupOrganizations()
      .then((orgs) => organizations = orgs))
    .then(() => GameHelper.setupGames(organizations, {
      active: NUM_ACTIVE_GAMES,
      finished: NUM_FINISHED_GAMES,
      upcoming: NUM_UPCOMING_GAMES,
    })
      .then((gamesObj) => games = gamesObj.active.concat(gamesObj.upcoming, gamesObj.finished)))
    .then(() => DonationHelper.setupDonations(organizations, games, users, NUM_DONATIONS))
    .then(() => process.exit(0));
};

// execute
popdb();
