const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:Ee123123@localhost:5432/exercise');
client.connect();

module.exports.selectRows = function(res, query) {
    client.query(query)
        .then(result => {
            return res.json(result.rows);
        })
        .catch(e => {
            // Log the error
            console.log(e.error);

            // Return bad status to the user
            res.status(400);
            return res.send("Something went wrong.");
        });
};

module.exports.addRow = function(res, query, params) {
    // Try to insert the data.
    client.query(query, params).then(() => {
        return res.send("Success!");
    }).catch((error) => {
        // Log the error
        console.log(error.error);

        // Return bas status to the user
        res.status(400);
        return res.send("Something went wrong.");
    });
};

module.exports.runIfTweetExists = function(res, tweet_id, action) {
    // Try to insert if the id exists
    client.query('SELECT * FROM tweets WHERE id = $1', [tweet_id])
        .then(result => {
            // Check if the tweet exists
            if (result.rows[0] === undefined) {
                res.status(400);
                return res.send("The post id does not belong to an existing tweet.");
            }

            // Run the action sent by parameter
            action();
        })
        .catch(e => {
            // Log the error
            console.log(e.error);

            // Return bad status to the user
            res.status(400);
            return res.send("Something went wrong.");
        });
};