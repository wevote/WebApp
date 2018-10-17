// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import BallotStore from "../../stores/BallotStore";
// import CandidateItemCompressed from "../../components/Ballot/CandidateItemCompressed";
// import Icon from "react-svg-icons";
// import LoadingWheel from "../../components/LoadingWheel";
// import { renderLog } from "../../utils/logging";
//
//
// export default class VoterGuideSettingsSuggestedBallotItems extends Component {
//   static propTypes = {
//     maximumSuggestedItems: PropTypes.number,
//   };
//
//   constructor (props) {
//     super(props);
//     this.state = {
//     };
//   }
//
//   render () {
//     renderLog(__filename);
//     if (!this.props.maximumSuggestedItems) {
//       return LoadingWheel;
//     }
//
//     let suggestedBallotItemsHtml = "";
//     let suggestedItemsCount = 0;
//     const maximumSuggestedItems = this.props.maximumSuggestedItems || 3;
//     let candidateList;
//     let ballotItemList = BallotStore.ballot;
//     if (ballotItemList) {
//       suggestedBallotItemsHtml = ballotItemList.map(ballotItem => {
//         if (suggestedItemsCount >= maximumSuggestedItems) {
//           return null;
//         } else if (ballotItem.kind_of_ballot_item === "OFFICE") {
//           candidateList = ballotItem.candidate_list;
//           if (candidateList) {
//             return candidateList.map(oneCandidate => {
//               if (suggestedItemsCount >= maximumSuggestedItems) {
//                 return null;
//               } else {
//                 suggestedItemsCount += 1;
//                 return <CandidateItemCompressed oneCandidate={oneCandidate} />;
//               }
//             });
//           } else {
//             return null;
//           }
//         } else if (ballotItem.kind_of_ballot_item === "MEASURE") {
//           return null;
//         } else {
//           return null;
//         }
//       });
//     }
//
//     const icon_size = 18;
//     let icon_color = "#999";
//
//     return <span>{ suggestedItemsCount > 0 ?
//       <div>
//         <div className="card">
//           <div className="card-main">
//             <h3 className="h3">Suggestions</h3>
//             <div className="u-padding-bottom--sm">
//               Click <span className="u-no-break"><span className="btn__icon"><Icon name="thumbs-up-icon"
//                                                                                    width={icon_size} height={icon_size} color={icon_color} /></span> Support</span> or&nbsp;
//               <span className="u-no-break"><span className="btn__icon"><Icon name="thumbs-down-icon"
//                                                                              width={icon_size} height={icon_size} color={icon_color} /></span> Oppose</span> to
//               add any of these suggestions to your ballot.
//             </div>
//             <div className="">{suggestedBallotItemsHtml}</div>
//           </div>
//         </div>
//       </div> :
//       null }</span>;
//   }
// }
