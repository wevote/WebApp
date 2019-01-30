import React, { Component } from "react";
import Helmet from "react-helmet";
import ReactPlayer from "react-player";
import styled from "styled-components";
import Paper from '@material-ui/core/Paper';
import AnalyticsActions from "../../actions/AnalyticsActions";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import { renderLog } from "../../utils/logging";
import ToolBar from "./ToolBar";
import VoterStore from "../../stores/VoterStore";

const TopSection = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1em;
`;

const BodySection = styled.div`
  line-height: 2;
  margin: 0 2em 1.5em 2em;
  font-size: 16.7px;
`;

const H1 = styled.h1`
  font-size: 36px;
  margin-bottom: 0;
`;

const H3 = styled.h3`
  font-size: 23px;
`;

const H4 = styled.h4`
  font-size: 18px;
`;

const VideoWrapper = styled.div`
  margin: 1.5em 0 1.5em 0;
  -webkit-box-shadow: 0px 3px 15px 2px rgba(176,176,176,1);
  -moz-box-shadow: 0px 3px 15px 2px rgba(176,176,176,1);
  box-shadow: 0px 3px 15px 2px rgba(176,176,176,1);
`;

export default class Organization extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    AnalyticsActions.saveActionAboutOrganization(VoterStore.electionId());
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Organization - We Vote" />
        <Paper>
          <TopSection>
            <H1>Our Vision</H1>
            <ToolBar />
            <VideoWrapper>
              <ReactPlayer url="https://www.youtube.com/embed/s8fGNj_nvWs" width="640px" />
            </VideoWrapper>
          </TopSection>
          <BodySection>
            <p>
              We Vote is building the next generation of voting tech. We&apos;re creating a digital voter guide
              informed by issues you care about and people you trust. Through our nonpartisan, open source platform,
              we&apos;ll help you become a better voter, up and down the ballot.
            </p>
            <p>
              You have a lot of decisions to make when you vote, and political campaigns don&apos;t always tell the
              whole truth. With fake news and misinformation, it&apos;s hard to tell which candidate or ballot initiative
              is on your side. Does that candidate for state legislature care about the same issues that you do?
              Does the awkwardly-worded ballot initiative support what you believe or is it the exact opposite
              (and was it purposely written to be so confusing?!)
            </p>
            <p>
              We Vote cuts through the clutter to help you understand what&apos;s on your ballot.
              Our open platform empowers voters to create and share voter guides that aggregate information
              and opinions across personal networks. So you can help your friends be better voters too.
            </p>
          </BodySection>
          <TopSection>
            <H3>A Nonprofit Startup</H3>
          </TopSection>
          <BodySection>
            We Vote is made of two nonpartisan nonprofit organizations (501(c)(3) and 501(c)(4)) based in
            Oakland, California. Our
            software is open source, and our work is driven by the nearly 100 volunteers who have contributed so far.
            Inspired by groups like
            <OpenExternalWebSite
              url="http://codeforsanfrancisco.org/"
              target="_blank"
              body={(
                <span>
                  Code for America&nbsp;
                  <i className="fa fa-external-link" />
                </span>
              )}
            />
            and the
            <OpenExternalWebSite
              url="https://www.mozilla.org/en-US/foundation/"
              target="_blank"
              className="open-web-site open-web-site__no-right-padding"
              body={(
                <span>
                  Mozilla Foundation&nbsp;
                  <i className="fa fa-external-link" />
                </span>
              )}
            />
            , we use technology to
            make democracy stronger by increasing voter turnout.
          </BodySection>
          <TopSection>
            <H3>Our Story</H3>
          </TopSection>
          <BodySection>
            <p>
              After meeting in Oakland in the spring of 2012, We Vote co-founders Dale McGrew, Jenifer Fernandez Ancona, Dan Ancona,
              and their families became fast friends and bought a home together,
              forming an intentional community. Through
              daily conversations, the idea of a nonprofit social voter network was born.
              &quot;We&#39;re living our values,&quot; says Jenifer. We Vote would be a community for voters, they
              decided, created
              from a communal home of people concerned about where this country is heading. Being an open
              source, volunteer-driven project means anyone can contribute. Kind of like democracy.
            </p>
            <H4>
              <OpenExternalWebSite
                url="https://help.wevote.us/hc/en-us/sections/115000140947-What-is-We-Vote-"
                target="_blank"
                className="open-web-site open-web-site__no-left-padding"
                body={(
                  <span>
                    Visit our help center to learn more about We Vote.&nbsp;
                    <i className="fa fa-external-link" />
                  </span>
                )}
              />
            </H4>
          </BodySection>
        </Paper>
      </div>
    );
  }
}
