import React, { Component } from "react";

import BallotStore from "../../stores/BallotStore";
import BallotActions from "../../actions/BallotActions";

export default class Ballot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballot: []
    };
  }

  componentDidMount () {
    BallotActions.init();

    this.__dispatchId =
      BallotStore.addListener( () => {
        this.setState({ ballot: BallotStore.ballot });
      });
  }

  render () {

    const ballot =
      <div className="ballot">
        {
          this.state.ballot.map( (item) =>
            <div className="ballot-item">
              {item.ballot_item_display_name}

              {
                item.candidate_list.map( (candidate) =>
                  <div className="candidate">
                    <img src={candidate.candidate_photo_url} />
                    {candidate.ballot_item_display_name}
                  </div>
                )

              }
            </div>
          )
        }
      </div>;

    return ballot;
  }

}
//   static propTypes = {
//     history: PropTypes.object,
//     children: PropTypes.object
//   };
//
//   constructor (props) {
//     super(props);
//
//     this.state = {
//       ballot: [],
//       loading: true,
//       error: false
//     };
//
//   }
//
//   concatenateBallotItem (item) {
//     const ballot = this.state.ballot.splice().concat([item]);
//     this.setState({ ballot, loading: false, error: false });
//   }
//
//   componentDidMount () {
//     BallotStore.addChangeListener(this.concatenateBallotItem.bind(this));
//
//     BallotActions.addBallotItems()
//     $ajax({
//       endpoint: "voterBallotItemsRetrieve",
//       success: (res) =>
//         (res.ballot_item_list),
//
//       error: (err) => console.log(err) || // log always returns undefined, then set state
//         this.addItem({ error: true, loading: false})
//
//     });
//   }
//
//   populateStores (ballotItems) {
//
//     ballotItems.forEach( (item) => {
//       const { we_vote_id: id, kind_of_ballot_item: type } = item;
//
//       try {
//         TYPES[type].addItemById(id, item);
//       } catch (e) {
//         console.error("Error:", e.message);
//       }
//
//     });
//   }
//
//   componentWillUnmount () {
//     OfficeStore.removeListener(ADDED, this.concatenateBallotItem.bind(this));
//     MeasureStore.removeChangeListener(this.concatenateBallotItem.bind(this));
//   }
//
//   render () {
//     var { loading } = this.state;
//
//     return loading ? LoadingWheel :
//       <div className="ballot">
//         { this.renderBallot() }
//       </div>;
//
//   }
//
//   renderBallot () {
//     if (this.state.error)
//       return <span> Error loading your ballot </span>;
//
//     const ballot = this.state.ballot.map( (item) => {
//
//       const {
//         we_vote_id: id,
//         kind_of_ballot_item: type,
//         ballot_item_display_name: displayName,
//         candidate_list: candidates = null
//       } = item;
//
//       const Type = TYPES[type].jsx; // Measure or Office, fallback to office
//
//       const props = {
//         key: id,
//         _raw: item
//       };
//
//       if (candidates) props.candidates = candidates;
//
//       const Item =
//         <Type {...props} >
//           <div className="display-name">
//             {displayName}
//           </div>
//
//           <Star key={id} type={type} />
//
//         </Type>;
//
//       return Item;
//
//     });
//
//     return ballot;
//   }
// }
