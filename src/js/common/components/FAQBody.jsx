import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isCordova, isWebApp } from '../utils/isCordovaOrWebApp';
import { renderLog } from '../utils/logging';
import ToolBar from './Widgets/ToolBar';
import webAppConfig from '../../config';


const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './Widgets/OpenExternalWebSite'));

export default class FAQBody extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('FAQBody');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <ContentTitle>
          Frequently Asked Questions
        </ContentTitle>
        <div
          style={{
            backgroundColor: '#2e3c5d',
            paddingTop: 20,
          }}
        >
          <ToolBar />
        </div>

        <br />
        <strong>What is WeVote?</strong>
        <br />
        WeVote is a nonprofit technology startup, creating a digital voter guide informed by
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="helpSiteValues"
            url="https://help.wevote.us/hc/en-us/articles/360034261733-How-were-the-Values-within-We-Vote-chosen-"
            target="_blank"
            body="issues you care about"
          />
        </Suspense>
        , and people you trust. Through our nonpartisan, open source platform, we&apos;ll help you become a better voter, up and down the ballot.
        <br />
        <br />

        <strong>How does WeVote help voters?</strong>
        <br />
        WeVote is where you view your ballot, see endorsements from your network for all
        candidates and measures, and collaborate with
        folks who share your
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="helpSiteValues"
            url="https://help.wevote.us/hc/en-us/articles/360034261733-How-were-the-Values-within-We-Vote-chosen-"
            target="_blank"
            body="values"
          />
        </Suspense>
        .
        <br />
        <br />

        <strong>Who&apos;s behind WeVote?</strong>
        <br />
        WeVote is a collaboration between two nonprofits
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteEducationWebsite"
            url="https://www.WeVoteEducation.org"
            target="_blank"
            body="www.WeVoteEducation.org"
          />
        </Suspense>
        - 501(c)(3) FEIN 47-2691544 and&nbsp;
        {/* August 2022, TODO: Re-enable this once the SSL cert is renewed */}
        {isCordova() ? (
          <>
            WeVoteUSA.org - 501(c)(4) FEIN 81-1052585,&nbsp;
          </>
        ) : (
          <>
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="weVoteUSAWebsite"
                url="https://www.WeVoteUSA.org"
                target="_blank"
                body="WeVoteUSA.org"
              />
            </Suspense>
            - 501(c)(4) FEIN 81-1052585,&nbsp;
          </>
        )}
        both based in Oakland, CA. We do not support or oppose any political candidate or party.
        We are not affiliated with WeVoteProject.org or WeVoteUSA.com.
        <br />
        <br />

        <strong>No really, who are you?</strong>
        <br />
        We are volunteers from across the country, in over 22 states. See our
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wevoteVolunteerNow"
            url="https://wevote.applytojob.com/apply"
            target="_blank"
            body="volunteer openings here"
          />
        </Suspense>
        , and join us! We use our engineering, design, marketing, and other skills to build
        WeVote. We are over 400 people (60+ active) who have donated 20,000+ volunteer hours, including
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wevoteGithubContributors"
            url="https://github.com/WeVote"
            target="_blank"
            body="100+ contributors on GitHub."
          />
        </Suspense>
        We also have
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteAboutUsPage"
            url={`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/about`}
            target="_blank"
            body="volunteer board members"
          />
        </Suspense>
        .
        <br />
        <br />

        <strong>How can I contact WeVote?</strong>
        <br />
        Please feel free to reach out to us with questions via our
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteContactUsPage"
            url="https://help.wevote.us/hc/en-us/requests/new"
            target="_blank"
            body="Contact Us form"
          />
        </Suspense>
        .
        {' '}
        Our mailing address is:
        <br />
        WeVote
        <br />
        1423 Broadway PMB 158
        <br />
        Oakland, CA 94612
        <br />
        <br />

        <strong>How does WeVote work?</strong>
        <br />
        Follow people and groups you trust to get info on candidates and ballot measures. Ask your friends
        what they think. Then take WeVote with you to
        the polls for an easy-to-use cheat sheet.
        <br />
        <br />

        <strong>Is this an app or a website?</strong>
        <br />
        We have a mobile-ready website, as well as
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteIPhone"
            url="https://apps.apple.com/us/app/we-vote-voter-guide/id1347335726"
            target="_blank"
            body="iPhone"
          />
        </Suspense>
        and
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteAndroid"
            url="https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US"
            target="_blank"
            body="Android"
          />
        </Suspense>
        apps.
        We are free and open source:
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wevoteGithub"
            url="https://github.com/WeVote"
            target="_blank"
            body="https://github.com/WeVote"
          />
        </Suspense>
        <br />
        <br />

        <strong>So who should I vote for?</strong>
        <br />
        That&apos;s up to you.
        <br />
        <br />

        <strong>Wait, what?</strong>
        <br />
        WeVote does not endorse any candidate or party.
        Our job is to help you make your own decisions,
        with help from your friends and trusted network.
        <br />
        <br />

        <strong>How does WeVote help nonprofits?</strong>
        <br />
        We provide a free place where organizations can share and promote their voter guides, including
        endorsements of candidates and
        ballot measures, and connect to constituents.
        <br />
        <br />

        <strong>Will you sell my email address?</strong>
        <br />
        Not a chance. WeVote will not sell your email address or any other individually identifiable information.
        (We don&apos;t want our email addresses sold either!) We may sell aggregated data.
        <br />
        <br />

        <strong>What does WeVote cost?</strong>
        <br />
        It&apos;s free!
        {' '}
        {isWebApp() && (
          <>
            If you like WeVote,
            {' '}
            <Link to="/donate" className="u-cursor--pointer u-link-color">please donate monthly</Link>
            {' '}
            so we can help more voters.
          </>
        )}
        <br />
        <br />

        <strong>How do you make money?</strong>
        <br />
        Like most nonprofits, we take in donations from individuals and foundations.
        <br />
        <br />

        <strong>How will you use my donation?</strong>
        <br />
        Expenses include server costs ($600 - $2,500 per month), data fees (~$40,000 per year), collaboration tools and other hard costs.
        In the future, we might hire some key staff with donations, for the smooth operation of WeVote.
        <br />
        <br />

        <strong>How will you handle trolls?</strong>
        <br />
        Unless your name is J.R.R. Tolkien, we know how much you hate trolls. That&apos;s why on WeVote you mainly hear from
        people and organizations that you Friend or Follow. WeVote reduces the noise from people with radically
        different
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="helpSiteValues"
            url="https://help.wevote.us/hc/en-us/articles/360034261733-How-were-the-Values-within-We-Vote-chosen-"
            target="_blank"
            body="values"
          />
        </Suspense>
        .
        <br />
        <br />

        <strong>What&apos;s next for WeVote?</strong>
        <br />
        Better tools to let organizations promote their voter guides and
        poll their members. Tools to let candidates ask for help from their supporters.
        <br />
        <br />

        <strong>Sounds great! How can I help?</strong>
        <br />
        We couldn&apos;t do what we do without volunteers and donors. Please
        {' '}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="idealistOpenPositions"
            url="https://wevote.applytojob.com/apply"
            target="_blank"
            className="open-web-site open-web-site__no-right-padding"
            body="sign up to volunteer"
          />
        </Suspense>
        {' '}
        and
        {' '}
        <Link to="/donate" className="u-cursor--pointer u-link-color">donate $5 monthly</Link>
        .
        <br />
        <br />
        <Link to="/" className="u-cursor--pointer u-link-color">Let&apos;s get started!</Link>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

