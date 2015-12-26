function Office (office_we_vote_id) {
    return {
        info: (callback) => new Promise (
            (resolve, reject) => request
                .get(`${url}/officeRetrieve`)
                .query({ csrfmiddlewaretoken: '6JXJadyuM75ngiXI9fU2voV7KI3iBYXO' })
                .query({ office_we_vote_id })
                .end( (err, res) => err ? reject(err) : resolve(res.body))
        )
        .then(callback)
        .catch(console.error),

        candidates: (callback) => new Promise (
            (resolve, reject) => request
                .get(`${url}/candidatesRetrieve`)
                .query({ csrfmiddlewaretoken: '6JXJadyuM75ngiXI9fU2voV7KI3iBYXO' })
                .query({ office_we_vote_id })
                .end( (err, res) => err ? reject(err) : resolve(res.body))
        )
        .then(callback)
        .catch(console.error)
    };
}
