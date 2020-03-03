import Stripe from 'stripe';

import DonationModel from '../models/donation.model';
import GameModel from '../models/game.model';
import { error } from '../response';
import { numPagesHeaderName } from '../config';
import { ResourceNotFoundError, StripeError, BadRequestError } from '../errors';
import DonationValidator from '../validators/donation.validator';
import express from 'express';
import io from 'socket.io-client'

export default class DonationController
{

  static getDonation(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    DonationModel.findOneDonation({ _id: req.params.id, userID: res.locals.token.id }, { populate })
      .then((donation) => res.json(donation))
      .catch((err) => error(res, err));
  }
  static getGameDonation(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    DonationModel.findGameDonations({gameID: req.params.gameID}, { populate })
    .then((donation) => res.json(donation))
    .catch((err) => error(res, err));
  }
  static getAllDonations(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    const page = (req.query.page !== undefined) ? req.query.page : 1;
    const filter = req.body;
    filter.userID = res.locals.token.id;

    DonationModel.findDonations(filter, { page, populate })
      .then((donations) => DonationModel.__getDonationsPageCount(filter)
        .then((count) => {
          if (page != 1 && page > count)
            throw new ResourceNotFoundError('page not found');
          res.set(numPagesHeaderName, count);
          return res.json(donations);
        }))
      .catch((err) => error(res, err));
  }

  static makeDonation(req, res)
  {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    DonationValidator.validateMakeDonation(req.body)
      .then((donation) => {
        // make sure the game is active
        if (req.body.gameID)
          return GameModel.findOneGame({ _id: req.body.gameID })
            .then((game) => {
              if (game === undefined || GameModel.gameIsFinished(game))
                throw new ResourceNotFoundError('That game is no longer active');

              let ok = false;
              for (let i = 0; i < game.organizations.length; i++)
                if (game.organizations[i]._id.toString() === req.body.organizationID)
                  ok = true;

              if (!ok)
                throw new ResourceNotFoundError('That organization ID is invalid for the given game');

              if (req.body.amount < req.body.tiles.length * game.price)
                throw new BadRequestError();
            });
        else
          return Promise.resolve(donation);
      })
      .then((donation) => {
        const charge = {
          amount: req.body.amount,
          source: req.body.source,
          currency: req.body.currency,
        };

        return stripe.charges.create(charge)
          .then((completed) => {
            DonationModel.createDonation({
              amount: req.body.amount,
              userID: res.locals.token.id,
              organizationID: req.body.organizationID,
              gameID: req.body.gameID,
              stripeID: completed.id,
              date: req.body.date,
              tiles: req.body.tiles,
            })
          })
          .catch((err) => {
            console.log(err)
            throw new StripeError(err); });
      })
      .then(() => {
        var donationData = {"gameId": req.body.gameID, "orgId": req.body.organizationID};
        // donationUpdate(donationData);
        var socket = io.connect('http://localhost:5555')
        socket.emit('donationOccur', donationData, () => {
          console.log("called the emit");
        });

      })
      .then(() => res.json({ success: true }))

      .catch((err) => error(res, err));
  }
}
