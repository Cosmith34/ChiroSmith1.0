const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db'); // this is your Knex instance

router.post('/signup', async (req, res) => {
  const {
    str_email,
    str_first_name,
    str_last_name,
    str_phone,
    dtm_date_of_birth
  } = req.body;

  const str_account_key = crypto.randomBytes(8).toString('hex');
  const str_account_type = 'Practitioner';
  const str_account_sub_type = 'Chiropractor';

  try {
    // Insert into tbl_account
    const [account] = await db('tbl_account')
      .insert({
        str_account_key,
        str_email,
        str_account_type,
        str_account_subtype: str_account_sub_type
      })
      .returning('uuid_account_id');

    const uuid_account_id = account.uuid_account_id;

    // Insert into tbl_account_info
    await db('tbl_account_info').insert({
      uuid_account_id,
      str_first_name,
      str_last_name,
      str_phone,
      dtm_date_of_birth
    });

    res.status(201).json({ message: 'Account created successfully', accountId: uuid_account_id });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
