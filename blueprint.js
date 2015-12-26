Blueprint = {
    _star: (0|1)
    _Comment: (text,date,friend,plus)

    Ballot: {
        props: {
            info,
            desc,
            opposition,
            * location,
            ballotItems{}
        }
    },

    Guide: {
        props:{
            * name,
            + stars,
            - support,
            bio,
            desc,
            organization,
            ballotItems{},
            comments{}
        },
        ** support
        ** oppose
        ** star
        ** unstar
        addballotitem
        addcandidate,
        addorganization,
        create,
        remove
    }

    Organization: {
        props: {
            * name,
            + stars,
            - support,
            bio,
            supporters,
            info,
            desc,
            commentItems{}
            * location,
        }
        ** support
        ** oppose
        ** start
        ** unstar
    }

    BallotItem < Office,Measure: {
        props: {
            * name,
            + star
            candidates{},
            comments{}
            * location
        }
        ** star
        ** unstar

    }

    Candidate: {
        props: {
            * name,
            + star,
            bio,
            ballotItems{},
            comments{}
            * location,
        },
        ** support
        ** oppose
        ** star
        ** unstar
    },

    }
    }

    friend: {
        props: {
            * name,
            age,
            email,
            bio,
            supporterOf<BallotItems{Organization,Candidates},
            friends{}
            * location,
        }
    }
}

API.voterBallotItemsRetrieve(items => Ballot.addBallotItem )
    .loadOffices(offices => Ballot.addOfficeInfo)
    .loadMeasures(measures => Ballot.addMeasureInfo)
    .loadCandidates(candidate => Ballot.addCandidate)



    //
    // var b1 = {
    //     id: 100,
    //     name: 'ballot1',
    //     date: new Date()
    // }
    //
    // var b2 = {
    //     id: 200,
    //     name: 'ballot2',
    //     date: new Date()
    // }
    //
    // var b3 = {
    //     id: 300,
    //     name: 'ballot3',
    //     date: new Date()
    // }
    //
    // var wb1 = {
    //     we_vote_id: '3b100',
    //     ballot_item_label: 'US Senate z1',
    //     local_ballot_order: '100'
    // }
    //
    // var b1b = new BallotItem(b1, true);
    // var b2b = new BallotItem(b2, false);
    // var b3b = new BallotItem(b3, false);
    // var wb1 = new BallotItem(wb1, true);

Office.prototype.type = 'Office';


get.Friends();
get.Friends(0).bio
get.Friends(1).bio

get.Ballots()
get.Ballots(0).everyItem;
Offices = get.Ballots(0).offices;
Measures = get.Ballots(0).measures;



BallotItem<T>
    _name, _date, _location, _vlocation
    CandidateList[Candidate]
    _Star
    _Unstar

BallotItem<Office>
BallotItem<Measure>

Ballot
    BallotItemList[Office,Measure]
    CommentList<Comment>

get.Ballots(0).offices
get.Offices();

// Object.prototype.defineStrict = (key, value) =>
//     Object.defineProperty(this, '_'+ key, {
//         configurable: false,
//         enumerable: false,
//         value: value,
//         writable: false
//     });

// var BallotItemMap = (function () {
//     var ballotMap = {};
//
//     return {
//         addItemById: function (id, data) {
//             ballotMap[id] = data;
//         },
//
//         removeItemById: function (id) {
//             var data = ballotMap[id];
//             return
//         }
//     };
// }());
