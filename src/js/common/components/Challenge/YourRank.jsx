import { Button } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import DesignTokenColors from '../Style/DesignTokenColors';
// import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper } from '../../components/Style/CampaignSupportStyles';
// import { SupportButtonFooterWrapper, SupportButtonPanel} from '../../components/Style/CampaignDetailsStyles';
import arrow from '../../../../img/global/icons/ph_arrow-up-bold.png';
import arrow1 from '../../../../img/global/icons/ph_arrow-up-bold_1.png';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';

const YourRank = ({ classes, challengeWeVoteId }) =>{
  const [clicked, setClicked] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [points, setPoints] = useState(0);
  // const [note, setNote] = useState("");
  const [arrowImage, setArrowImage] = useState(arrow);
  const [rankOfVoter, setRankOfVoter] = React.useState(0);

  const onAppObservableStoreChange = () => {
    setRankOfVoter(AppObservableStore.getChallengeParticipantRankOfVoterByChallengeWeVoteId(challengeWeVoteId));
  };

  const onChallengeParticipantStoreChange = () => {
    const sortedParticipantsWithRank = ChallengeParticipantStore.getChallengeParticipantList(challengeWeVoteId);
    setParticipantsCount(sortedParticipantsWithRank.length);
  };

  const handleClick = () => {
    setPoints((prevPoints) => {
      const newPoints = prevPoints + 1;
      setClicked(true);
      setArrowImage(arrow1);

      setTimeout(() => {
        setClicked(false);
        setArrowImage(arrow);
      }, 3000);
      return newPoints;
    });
  };

  React.useEffect(() => {
    // console.log('Fetching participants for:', challengeWeVoteId);
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      challengeParticipantStoreListener.remove();
    };
  }, [challengeWeVoteId]);
  return (
    <YourRankWrapper>
      <div
        className="rank"
        style={{
          width: '267px',
          height: '20px',
          top: '449px',
          left: '56px',
          gap: '0px',
          opacity: '0px',
          fontFamily: 'Poppins',
          fontSize: '13px',
          fontWeight: '400',
          lineHeight: '19.5px',
          textAlign: 'left',
          color: 'var(--Neutral-700, #484848)'
        }}
      >
        <h1>Your rank in the challenge:</h1>
      </div>
      <CompleteYourProfileButtonWrapper clicked={clicked}>
        <Button
          onClick={handleClick}
          classes={{ root: classes.buttonDesktop }}
          style={{ color: clicked ? '#FFFFFF' : '#AC5204' }}
        >
          #
          {rankOfVoter}
          {' '}
          <span className="arrow">
            <img src={arrowImage} alt="arrow" classes ={{ root: classes.arrow}}/>
          </span>
        </Button>
      </CompleteYourProfileButtonWrapper>
    </YourRankWrapper>
  );
  };
  const styles = (theme) => ({
    buttonDesktop: {
      boxShadow: 'none !important',
      color: '#AC5204',
      width: '105px',
      height: '34px',
      border: '1px solid #AC5204',
      borderRadius: '20px 20px 20px 20px',
      transition: 'color 0.3s ease',
      textTransform: 'none',
      width: '100%',
    },
    desktopSimpleLink: {
      border: '2px solid #AC5204',
      boxShadow: 'none !important',
      color: '#999',
      marginTop: 10,
      padding: '0 20px',
      textTransform: 'none',
      width: 250,
    },
    mobileSimpleLink: {
      boxShadow: 'none !important',
      color: '#999',
      marginTop: 10,
      padding: '0 20px',
      textTransform: 'none',
      width: '100%',
      '&:hover': {
        color: '#4371cc',
        textDecoration: 'underline',
      },
    },
    arrow: {
      width: '10.5px',
      height: '12.5px',
      top: '2.75px',
      left: '14.25px',
      gap: '0px',
      opacity: '0px',
      angle: '-90 deg',
    },
  });
  const ChallengeTabsWrapper = styled('div')`
    background-color: ${DesignTokenColors.neutralUI50};
    display: flex;
    justify-content: center;
  `;
  const YourRankWrapper = styled('div')`
    background-color: ${DesignTokenColors.neutralUI50};
    display: flex;
    justify-content: center;
  `;
  const CompleteYourProfileButtonWrapper = styled('div')`
    background-color: ${(props)=>(props.clicked ? "#AC5204" : "#FFFFFF")};
    width: 105px;
    height: 34px;
    top: 443px;
    left: 234px;
    gap: 0px;
    border-radius: 20px;
    border: 1px solid #AC5204,
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, color 0.3s ease;
  `;
export default withStyles(styles)(YourRank);




// import { Button } from '@mui/material';
// import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper } from '../../components/Style/CampaignSupportStyles';
// import { SupportButtonFooterWrapper, SupportButtonPanel} from '../../components/Style/CampaignDetailsStyles';
// // Import pngs
// import vector from '../../../../img/global/icons/Vector.png';
// import vector1 from '../../../../img/global/icons/Vector1.png';
// import vector8 from '../../../../img/global/icons/Vector 8.png';
// import vector9 from '../../../../img/global/icons/Vector 9.png';
// import vector11 from '../../../../img/global/icons/Vector 11.png';
// import vector12 from '../../../../img/global/icons/Vector 12.png';
// import vector13 from '../../../../img/global/icons/Vector 13.png';
// import yellow_star from '../../../../img/global/icons/material-symbols_star.png';
// import orange_star from '../../../../img/global/icons/material-symbols_star1.png';
// import ellipse273 from '../../../../img/global/icons/Ellipse 273.png';
// import ellipse274 from '../../../../img/global/icons/Ellipse 274.png';
// import ellipse275 from '../../../../img/global/icons/Ellipse 275.png';
// import ellipse276 from '../../../../img/global/icons/Ellipse 276.png';
// import arrow from '../../../../img/global/icons/ph_arrow-up-bold.png';
// import arrow1 from '../../../../img/global/icons/ph_arrow-up-bold_1.png';
// // import Button from "@mui/material";
// const URL = '/:challengeSEOFriendlyPath/+/customize-message';
//
// const YourRank =({classes})=>{
// //   console.log(classes)
//   const [clicked, setClicked] = useState(false);
//   const [points, setPoints] = useState(0);
//   const [note, setNote] = useState("");
//   const [arrowImage, setArrowImage] = useState(arrow)
//
//   const calculateRank = (points) => 5336 + points * 5;
//
//   const handleClick = () => {
//     setPoints((prevPoints) => {
//       const newPoints = prevPoints + 1;
//       setClicked(true);
//       setArrowImage(arrow1)
//       setNote("1 point earned. You move up by 5 ranks!");
//
//       setTimeout(() => {
//         setClicked(false);
//         setNote("");
//         setArrowImage(arrow)
//       }, 3000);
//       return newPoints;
//     });
//   };
//   return (
//     <YourRankWrapper>
//       <div
//         className="rank"
//         style={{
//           width: '267px',
//           height: '20px',
//           top: '449px',
//           left: '56px',
//           gap: '0px',
//           opacity: '0px',
//           fontFamily: 'Poppins',
//           fontSize: '13px',
//           fontWeight: '400',
//           lineHeight: '19.5px',
//           textAlign: 'left',
//           color: 'var(--Neutral-700, #484848)'
//         }}
//       >
//         <h1>Your rank in the challenge:</h1>
//       </div>
// {/*       <ConfettiWrapper className="confetti" */}
// {/*         style={{ */}
// {/*           display: clicked ? "block" : 'none', */}
// {/*           top: '-50px'}} */}
// {/*           > */}
// {/*         <img */}
// {/*           src={ellipse273} */}
// {/*           alt="ellipse273" */}
// {/*           classes ={{ root: classes.ellipse273 }} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={yellow_star} */}
// {/*           alt="star" */}
// {/*           classes ={{ root: classes.yellow_star}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={vector8} */}
// {/*           alt="vector8" */}
// {/*           classes ={{ root: classes.vector8}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={ellipse274} */}
// {/*           alt="ellipse274" */}
// {/*           classes ={{ root: classes.ellipse274}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={vector13} */}
// {/*           alt="vector_13" */}
// {/*           classes ={{ root: classes.vector13}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={vector11} */}
// {/*           alt="vector11" */}
// {/*           classes ={{ root: classes.vector11}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={vector9} */}
// {/*           alt="vector9" */}
// {/*           classes ={{ root: classes.vector9}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={ellipse276} */}
// {/*           alt="ellipse276" */}
// {/*           classes ={{ root: classes.ellipse276}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={vector1} */}
// {/*           alt="blue_star" */}
// {/*           classes ={{ root: classes.vector1}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={vector12} */}
// {/*           alt="vector12" */}
// {/*           classes ={{ root: classes.vector12}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={ellipse275} */}
// {/*           alt="ellipse275" */}
// {/*           classes ={{ root: classes.ellipse275}} */}
// {/*         /> */}
// {/*         <img */}
// {/*           src={orange_star} */}
// {/*           alt="red_star" */}
// {/*           classes={{ root: classes.orange_star }} */}
// {/*         /> */}
// {/*        </div>  */}
// {/*        <SupportButtonPanel >  */}
// {/*          <Button onClick={handleClick} className={classes.ChallengeTabsWrapperButton} clicked={clicked.toString()}> # {calculateRank(points)}  */}
// {/*            <span className="arrow"><img src={arrowImage} alt="arrow" className={classes.arrow}/></span>  */}
// {/*          </Button>  */}
// {/*          </ SupportButtonPanel> */}
// {/*        <div>  */}
// {/*         {note && <p style={{ color: "#AC5204" ,width: '196px', */}
// {/*           height: '28px', */}
// {/*           top: '481px', */}
// {/*           left: '191px', */}
// {/*           gap: '0px', */}
// {/*           opacity: '0px', */}
// {/*         }}>{note}</p>} */}
// {/*       </ConfettiWrapper> */}
//       <SupportButtonPanel >
//         <Button
//           onClick={handleClick}
//           classes={{ root: classes.buttonDesktop }}
//           clicked={clicked}
//         >
//           # {calculateRank(points)}
//           <span className="arrow">
//             <img src={arrowImage} alt="arrow" classes ={{ root: classes.arrow}}/>
//           </span>
//         </Button>
//       </SupportButtonPanel>
//    </YourRankWrapper>
//   );
// };
//
// const styles = () => ({
//
//     buttonDesktop: {
//     boxShadow: 'none !important',
//     fontSize: '18px',
//     height: '45px !important',
//     padding: '0 12px',
//     textTransform: 'none',
//     width: '100%',
//   },
//   desktopSimpleLink: {
//     boxShadow: 'none !important',
//     color: '#999',
//     marginTop: 10,
//     padding: '0 20px',
//     textTransform: 'none',
//     width: 250,
//     '&:hover': {
//       color: '#4371cc',
//       textDecoration: 'underline',
//     },
//   },
//   mobileSimpleLink: {
//     boxShadow: 'none !important',
//     color: '#999',
//     marginTop: 10,
//     padding: '0 20px',
//     textTransform: 'none',
//     width: '100%',
//     '&:hover': {
//       color: '#4371cc',
//       textDecoration: 'underline',
//     },
//   },
//   arrow: {
//     width: '10.5px',
//     height: '12.5px',
//     top: '2.75px',
//     left: '14.25px',
//     gap: '0px',
//     opacity: '0px',
//     angle: '-90 deg'
//   },
//   ellipse273: {
//     width: '3px',
//     height: '3px',
//     top: '448px',
//     left: '228px',
//     opacity: '0px'
//   },
//   ellipse274: {
//     width: '3px',
//     height: '3px',
//     top: '434px',
//     left: '259px',
//     opacity: '0px'
//   },
//   ellipse275:{
//    width: '3px',
//    height: '3px',
//    top: '437px',
//    left: '331px',
//    gap: '0px',
//    opacity: '0px',
//   },
//   ellipse276:{
//     width: '3px',
//     height: '3px',
//     top: '423px',
//     left: '302px',
//     gap: '0px',
//     opacity: '0px'
//   },
//   orange_star: {
//     width: '11px',
//     height: '11px',
//     top: '432px',
//     left: '338.11px',
//     padding: '0.92px 0.92px 1.37px 0.92px',
//     gap: '0px',
//     opacity: '0px',
//     angle: '-16.42 deg'
//   },
//   vector1: {
//    width: '11px',
//    height: '11px',
//    top: '427px',
//    left: '302.11px',
//    padding: '0.92px 0.92px 1.37px 0.92px',
//    gap: '0px',
//    opacity: '0px',
//    angle: '-16.42 deg'
//   },
//   vector8: {
//     width: '0px',
//     height: '9.37px',
//     top: '428px',
//     left: '243px',
//     border: '2px 0px 0px 0px',
//     opacity: '0px'
//   },
//   vector9:{
//     height: '9.37px',
//     top: '429px',
//     left: '291.96px',
//     border: '2px 0px 0px 0px'
//   },
//   vector11: {
//     width: '0px',
//     height: '7.12px',
//     top: '431px',
//     left: '274px',
//     border: '2px 0px 0px 0px',
//     opacity: '0px'
//   },
//   vector12: {
//     width: '0px',
//     height: '9.37px',
//     top: '427px',
//     left: '324.43px',
//     gap: '0px',
//     border: '2px 0px 0px 0px',
//     opacity: '0px',
//     angle: '-15 deg'
//   },
//   vector13: {
//     height: '7.07px',
//     top: '423.02px',
//     left: '256.29px',
//     border: '2px 0px 0px 0px'
//   },
//   yellow_star: {
//     width: '11px',
//     height: '11px',
//     top: '435.81px',
//     left: '222px',
//     padding: '0.92px 0.92px 1.37px 0.92px',
//     opacity: '0px'
//   }
// });
// const ChallengeTabsWrapper = styled('div')`
//   background-color: ${DesignTokenColors.neutralUI50};
//   display: flex;
//   justify-content: center;
// `;
// const YourRankWrapper = styled('div')`
//   background-color: ${DesignTokenColors.neutralUI50};
//   display: flex;
//   justify-content: center;
// `;
// const ConfettiWrapper = styled('div')`
//   background-color: ${DesignTokenColors.neutralUI50};
//   display: flex;
//   justify-content: center;
// `;
// const ChallengeTabsWrapperButton = styled(Button)`
//   background-color: ${(props)=>(props.clicked ? "#AC5204" : "#FFFFFF")};
//   color: ${(props)=> (props.clicked ? "white" : "#AC5204")};
//   width: 105px;
//   height: 34px;
//   top: 443px;
//   left: 234px;
//   gap: 0px;
//   border-radius: 20px 20px 20px 20px;
//   border: '1px solid var(--Accent-500, #AC5204)',
// `;
// export default withStyles(styles)(YourRank);


